/**
 * @module ParagraphRecord
 */

import Sentence from './Sentence';
import { punctuationRe, singleWhitespaceRe } from './Constants';
import { CharacterMetadata } from 'draft-js';
 
/** 
 * @classdesc Class to model a ContentBlock state record
 */
export default class ParagraphRecord {
 
    /**
     * Create a new state record containing the data:
     * {
     *     block        -- ContentBlock
     *     hashCode     -- simple checksum on plain text of ContentBlock, used to quickly ascertain if block has changed
     *     nChars       -- number of characters in block text
     *     nSpaces      -- number of whitespace characters in block text
     *     nPunctuation -- number of punctuation characters in block text
     *     sentences    -- array of Sentence objects representing the sentences contained in paragraph block
     * }
     */
    constructor() {
        Object.assign(this, {
            block: null,
            hashCode: 0,
            nChars: 0,
            nSpaces: 0,
            nPunctuation: 0,
            sentences: [] 
        });
    }

    getSentences() {
        return(this.sentences);
    }

    /**
     * Initialise the state record to given text
     * @param {ContentBlock} block 
     * @param {Object} highlightStates -- { <switch_name>: { switchState : t|f, highlightEntity: <entity_key> }, ... }
     */
    stateUpdate(block, highlightStates) {

        console.group('setText()');
        console.log('Paragraph state record before update:\n', this);

        const key = block.getKey();
        const text = block.getText();
        console.log('Check block', key, 'for changes...');

        let newHash = this._hashCode(text);
        if (newHash != this.hashCode) {            
            /* Text has changed => recompute all fields */
            console.log('Hash code discrepancy - new: ', newHash, 'old: ', this.hashCode, '=> changes have occurred');
            Object.assign(this, {
                block: block,
                hashCode: newHash,
                nChars: text.length,
                nSpaces: (text.match(singleWhitespaceRe) || []).length,
                nPunctuation: (text.match(punctuationRe) || []).length,
                sentences: this._splitIntoSentences(text)
            });
            /* Update character metadata */
            console.log('--- Character metadata:');
            this.block.getCharacterList().forEach(cm => {
                console.log(cm);
                //CharacterMetadata.applyEntity();
                CharacterMetadata.applyStyle(cm, 'BOLD');
                console.log(cm.getStyle());
            });
            console.log('---End');
        } else {
            console.log('Hash codes equal => no change');
        }

        console.log('Paragraph state record after update:\n', this);
        console.groupEnd();
    }

    /**
     * Word count for paragraph
     * @param {int} syllableThreshold only count words > this number of syllables
     * @return number of words
     */
    wordCount(syllableThreshold = 1) {
        let nWords = 0;
        if (this.sentences.length > 0) {
            nWords = this.sentences.map(s => s.wordCount(syllableThreshold)).reduce((partialSum, a) => partialSum + a, 0);
        }
        return(nWords);
    }

    /**
     * Syllable count for paragraph
     * @return number of words
     */
    syllableCount() {
        let nSyllables = 0;
        if (this.sentences.length > 0) {
            nSyllables = this.sentences.map(s => s.syllableCount()).reduce((partialSum, a) => partialSum + a, 0);
        }
        return(nSyllables);
    }

    forAllSentences(callback) {
        for (const s of this.sentences) {
            if (!callback(s)) {
                return(false);
            }
        }
        return(true);
    }

    /**
     * Check for a trivial and ultimately pointless paragraph created by draft-js (e.g. contains only carriage return)
     * @returns boolean true if paragraph block is null, or text only contains whitespace
     */
    isNullParagraph() {
        let trivial = true;
        if (this.block != null) {
            const text = this.block.getText();
            trivial = text.trim().length == 0;
        }
        return(trivial);
    }

    /**
     * Decompose text into individual (trimmed) sentences
     * @param {String} text
     * @return {Array<Sentence>}
     */
    _splitIntoSentences(text) {
        let sentences = [];
        let offset = text.search(/\S/);
        if (offset >= 0) {
            
        }
        let trimmed = text.trim();
        if (trimmed != '') {
            let sentenceTexts = trimmed.split(punctuationRe).map(s => s.trim());
            sentenceTexts.forEach(st => {
                if (st != '') {
                    sentences.push(new Sentence(st));
                }                
            });
        }
        return(sentences);
    }

    /**
     * Returns a hash code from a string
     * https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript answer by Barak
     * @param  {String} str string to hash.
     * @return {Number} 32bit integer
     * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     */
     _hashCode(str) {
        let hash = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; /* Convert to 32bit integer */
        }
        return(hash);
    }

}