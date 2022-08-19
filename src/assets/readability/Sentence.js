/**
 * @module Sentence
 */

import { syllable } from "syllable";
import { localeLang, multiWhitespaceRe, sentenceComplexityThreshold } from './Constants';

/** 
 * @classdesc Class to model a sentence
 * @param {String} Text         -- sentence text
 * @param {int} paraOffsetStart -- start offset within owning paragraph (ContentBlock)
 * @param {int} paraOffsetEnd   -- end offset within owning paragraph (ContentBlock)
 */
export default class Sentence {

    constructor(text, paraOffsetStart, paraOffsetEnd) {
        this.text = text;
        this.paraOffsetStart = paraOffsetStart;
        this.paraOffsetEnd = paraOffsetEnd;
    }

    /**
     * Get words in sentence
     * @param {int} syllableThreshold only return words > this number of syllables
     * @return {Array<String>} words
     */
    getWords(syllableThreshold = 1) {
        let words = [];
        let trimmed = this.text.trim().toLocaleLowerCase(localeLang);
        if (trimmed != '') {
            words = trimmed.split(multiWhitespaceRe);
            console.log('words.length', words.length);
            if (syllableThreshold > 1) {                
                words = words.filter(w => syllable(w) >= syllableThreshold);
                console.log('words.length after', syllableThreshold, 'syllable filter', words.length);
            }
        }
        return(words);
    }

    /**
     * Count number of words in text
     * @param {int} syllableThreshold only count words > this number of syllables
     * @return word count
     */
    wordCount(syllableThreshold = 1) {
        return(this.getWords(syllableThreshold).length);
    }

    /**
     * Count number of syllables in text
     * @return syllable count
     */
    syllableCount() {
        return(syllable(this.text.toLocaleLowerCase(localeLang)));
    }

    /**
     * Complexity calculated via simplified SMOG index (https://readable.com/readability/smog-index/)
     * NOTE: need to decide an official way of determining this and other metrics
     * @return if sentence complex
     */
    isComplex() {

        console.group('isComplex()');
        console.log('Check', this.text, 'is complex');

        let smog = 3.0 + Math.sqrt(this.wordCount(3));

        console.log('SMOG index', smog, 'complex', smog >= sentenceComplexityThreshold);
        console.groupEnd();

        return(smog >= sentenceComplexityThreshold);
    }

}
