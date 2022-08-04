/**
 * @module ParagraphRecord
 */

import Sentence from './Sentence';
import { punctuationRe, singleWhitespaceRe } from './Constants';
 
/** 
 * @classdesc Class to model a ContentBlock state record
 */
export default class ParagraphRecord {
 
    /**
     * Create a new state record containing the data:
     * {
     *     hashCode     -- simple checksum on plain text of ContentBlock, used to quickly ascertain if block has changed
     *     nChars       -- number of characters in block text
     *     nSpaces      -- number of whitespace characters in block text
     *     nPunctuation -- number of punctuation characters in block text
     *     sentences    -- array of Sentence objects representing the sentences contained in paragraph block
     * }
     * @param {String} initialText model initialisation text
     */
    constructor(initialText = '') {
        Object.assign(this, {
            hashCode: 0,
            nChars: 0,
            nSpaces: 0,
            nPunctuation: 0,
            sentences: [] 
        });
        if (initialText != '') {
            this.setText(initialText);
        }
    }

    getSentences() {
        return(this.sentences);
    }

    /**
     * Initialise the state record to given text
     * @param {String} text 
     */
    setText(text) {

        console.group('setText()');
        console.log('Initialise paragraph record to', text);

        let newHash = this._hashCode(text);
        if (newHash != this.hashCode) {
            /* Text has changed => recompute all fields */
            console.log('Hash code discrepancy - new: ', newHash, 'old: ', this.hashCode, '=> changes have occurred');
            Object.assign(this, {
                hashCode: newHash,
                nChars: text.length,
                nSpaces: (text.match(singleWhitespaceRe) || []).length,
                nPunctuation: (text.match(punctuationRe) || []).length,
                sentences: this._splitIntoSentences(text)
            })
        } else {
            //TODO this is never happening, so wonder why?
            console.log('Hash codes equal => no change');
        }

        console.log(JSON.stringify(this));
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
     * Decompose text into individual (trimmed) sentences
     * @param {String} text
     * @return {Array<Sentence>}
     */
    _splitIntoSentences(text) {
        let sentences = [];
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