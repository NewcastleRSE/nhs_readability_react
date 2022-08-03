/**
 * @module Sentence
 */

import { syllable } from "syllable";
import { localeLang, multiWhitespaceRe, sentenceComplexityThreshold } from './Constants';

/** 
 * @classdesc Class to model a sentence
 */
export default class Sentence {

    constructor(text) {
        this.text = text;
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
            console.log('Words before', words);
            if (syllableThreshold > 1) {                
                words = words.filter(w => {
                    const syllables = syllable(w);
                    console.log(syllables, 'syllables in word', w, 'threshold is', syllableThreshold, 'function return', syllables >= syllableThreshold);
                    return(syllables >= syllableThreshold);
                });                
            }
        }
        console.log('Words after', words);  
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
