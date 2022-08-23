/**
 * @module Sentence
 */

import { syllable } from "syllable";
import { localeLang, multiNonWhitespaceRe, multiWhitespaceRe, sentenceComplexityThreshold } from './Constants';

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
     * Find all the words in the sentence along with their offsets within it
     * @param {int} syllableThreshold 
     * @returns {Array<Object>} ranges as { text: <the_word>, sentenceOffsetStart: <int>, sentenceOffsetEnd: <int> }
     */
    getWordRanges(syllableThreshold = 1) {
        let ranges = [];
        const lcText = this.text.toLocaleLowerCase(localeLang);
        const matches = lcText.matchAll(multiNonWhitespaceRe);
        for (const match of matches) {
            const word = match[0];
            if (syllable(word) >= syllableThreshold) {
                ranges.push({
                    text: match[0],
                    sentenceOffsetStart: match.index,
                    sentenceOffsetEnd: match.index + match[0].length
                });
            }            
        }
        return(ranges);
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
