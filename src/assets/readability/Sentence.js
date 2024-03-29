/**
 * @module Sentence
 */

import { syllable } from "syllable";
import { localeLang, multiNonWhitespaceRe, multiWhitespaceRe, sentenceComplexitySmogRange } from './Constants';
// @ts-ignore
import passive from "passive-voice";

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
            console.debug('words.length', words.length);
            if (syllableThreshold > 1) {                
                words = words.filter(w => syllable(w) >= syllableThreshold);
                console.debug('words.length after', syllableThreshold, 'syllable filter', words.length);
            }
        }
        return(words);
    }

    /**
     * Get words in sentence
     * @param {int} syllableThreshold only return words > this number of syllables
     * @return {Array<String>} words
     */
    getLongWords(syllableThreshold = 3) {
        let words = [];
        let trimmed = this.text.trim().toLocaleLowerCase(localeLang);
        if (trimmed != '') {
            words = trimmed.split(multiWhitespaceRe);
            if (syllableThreshold > 3) {                
                words = words.filter(w => syllable(w) >= syllableThreshold);;
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
     * @param {int} syllableThreshold               -- only count words > this number of syllables
     * @param {Object<key, value>} filterDictionary -- only count words NOT in this dictionary/vocabulary
     */
    wordCount(syllableThreshold = 1, filterDictionary = null) {
        let count = 0;
        if (filterDictionary == null) {
            count = this.getWords(syllableThreshold).length;
        } else {
            this.getWordRanges(syllableThreshold).forEach(wr => {
                if (!filterDictionary[wr.text]) {
                    count++;
                }
            });
        }        
        return(count);
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
     * According to the "Plain English Medical Guide":
     * "A good average sentence length ('ASL') is 15 to 20 words. Use shorter ones
     * for 'punch'. Longer ones should not have more than three items of information;
     * otherwise they get overloaded, and readers lose track."
     * @return if sentence complex
     */
    isComplex() {

        console.group('isComplex()');

        let isComplex = false;
        let longSentence = this.wordCount(this.text);

        /* use word count in sentence */
        if(longSentence >= 15){
          isComplex = true;
        }

        console.debug('complex', isComplex, 'Words in sentence', longSentence);
        console.groupEnd();

        return(isComplex);
    }

    isPassive() {

        console.group('isPassive()');
        console.debug('Check', this.text, 'is passive');

        let isPassive = passive(this.text);
        if(isPassive.length){
            return true;
        }
        else {
            return false;
        }

    }

}
