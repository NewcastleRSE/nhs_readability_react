/**
 * @module ParagraphRecord
 */

import Sentence from './Sentence';
import { punctuationRe, singleWhitespaceRe } from './Constants';
import { prismWords } from './PrismWords';
import { SelectionState } from 'draft-js';
import { syllable } from "syllable";
import { localeLang } from './Constants';
 
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
     */
    stateUpdate(block) {

       /* console.group('setText()');
        console.log('Paragraph state record before update:\n', this); */

        const key = block.getKey();
        const text = block.getText();
        console.debug('Check block', key, 'for changes...');

        let newHash = this._hashCode(text);
        if (newHash != this.hashCode) {            
            /* Text has changed => recompute all fields */
            console.debug('Hash code discrepancy - new: ', newHash, 'old: ', this.hashCode, '=> changes have occurred');
            Object.assign(this, {
                block: block,
                hashCode: newHash,
                nChars: text.length,
                nSpaces: (text.match(singleWhitespaceRe) || []).length,
                nPunctuation: (text.match(punctuationRe) || []).length,
                sentences: this._splitIntoSentences(text)
            });

            console.debug('End');

        } else {
            console.debug('Hash codes equal => no change');
        }

        console.debug('Paragraph state record after update:\n', this);
        console.groupEnd();
    }

    /**
     * Return array of text ranges representing complex sentences
     * @return {Array<SelectionState>} ranges
     */
    markComplex() {

        console.group('markComplex()');
        let ranges = this.sentences.filter(s1 => s1.isComplex()).map(s2 => {
            return({
                start: s2.paraOffsetStart,
                end: s2.paraOffsetEnd + 1
            });
        }); 
        console.groupEnd();
        return(ranges);
    }

    markPassive() {

        console.group('markPassive()');
        let ranges = this.sentences.filter(s1 => s1.isPassive()).map(s2 => {
            return({
                start: s2.paraOffsetStart,
                end: s2.paraOffsetEnd + 1
            });
        }); 
        console.groupEnd();
        return(ranges);
    }

    /**
     * Return array of text ranges representing PRISM words
     * Referred to as 'complex' words in the editor
     */
     markPrismWords() {

        console.group('markPrismWords()');
        let ranges = [];
        this.sentences.forEach(s => {
            s.getWordRanges().forEach(wr => {
               if (prismWords[wr.text]) {
                    ranges.push({
                        start: s.paraOffsetStart + wr.sentenceOffsetStart,
                        end: s.paraOffsetStart + wr.sentenceOffsetEnd
                    });
                } 
                
            });
        });
        console.groupEnd();
        return(ranges);
    }

     /**
     * Return array of text ranges contaning long words (4 or more syllables)
     * @return {Array<SelectionState>} ranges
     */
      markLongWords() {
        console.group('markLongWords()');
        let ranges = [];
        this.sentences.forEach(s => {
            s.getWordRanges().forEach(wr => {
 
                let numSyllables = syllable(wr.text.toLocaleLowerCase(localeLang));
                if (numSyllables > 3) {
                    /* console.log(wr.text);
                    console.log(syllable(wr.text.toLocaleLowerCase(localeLang))); */
                    ranges.push({
                        start: s.paraOffsetStart + wr.sentenceOffsetStart,
                        end: s.paraOffsetStart + wr.sentenceOffsetEnd
                    });
                }     
            });
        });
        console.groupEnd();
        return(ranges);
    }

    /**
     * Word count for paragraph
     * @param {int} syllableThreshold               -- only count words > this number of syllables
     * @param {Object<key, value>} filterDictionary -- only count words NOT in this dictionary/vocabulary}
     * @return number of words
     */
    wordCount(syllableThreshold = 1, filterDictionary = null) {
        let nWords = 0;
        if (this.sentences.length > 0) {
            nWords = this.sentences.map(s => s.wordCount(syllableThreshold, filterDictionary)).reduce((partialSum, a) => partialSum + a, 0);
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

        console.group('_splitIntoSentences()');
        console.log('Paragraph text:\n', text);

        let sentences = [];
        let offset = 0;
        const matches = text.matchAll(punctuationRe);
        
        for (const match of matches) {
            if (match.index != offset) {
                sentences.push(new Sentence(text.substring(offset, match.index), offset, match.index - 1));
            }
            offset = match.index + match[0].length;            
        }
        if (offset < text.length) {
            sentences.push(new Sentence(text.substring(offset, text.length), offset, text.length - 1));
        }

        console.log('Created sentences:\n', sentences);
        console.groupEnd();

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