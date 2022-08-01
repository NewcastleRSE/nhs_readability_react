/**
* @module Sentence
*/

import { v4 as uuidv4 } from 'uuid';
import { syllable } from "syllable";

const LOCALE_LANG = "en-UK";

const COMPLEXITY_THRESHOLD = 4.0;

const DEFAULT_OPTIONS = {
    id: "",                 /* UUID of sentence */
    rawText: "",            /* Text of the sentence including linebreaks, punctuation and whitespace */
    parentStart: 0,         /* Start of the sentence (i.e first non-whitespace) in parent text  */
    parentEnd: 0,           /* End of sentence (i.e. final punctuation or last character if none) */
    dirty: false,           /* If sentence has changed */
    analysis: null,         /* TODO - analysis of medical terms */
    complete: false         /* True if sentence has a completing punctuation mark, false otherwise */
};

/** 
 * @classdesc Class to model a sentence
 */
export default class Sentence {

    /* Punctuation if '?' or '!' or '.' where not part of a floating point number of section number (e.g. 1.2.11) */
    static PUNCTUATION_RE = /[?!]+|(?<!\d+)\.(?!\d+)/g;

    constructor(options) {
        Object.assign(this, DEFAULT_OPTIONS, options, {
            id: `s-${uuidv4()}`
        });
    }

    get id() {
        return(this._id);
    }

    set id(id) {
        this._id = id;
    }
    
    get rawText() {
        return(this._rawText);
    }

    set rawText(text) {
        this._rawText = text;
    }

    get parentStart() {
        return(this._parentStart);
    }

    set parentStart(position) {
        this._parentStart = position;
    }

    get parentEnd() {
        return(this._parentEnd);
    }

    set parentEnd(position) {
        this._parentEnd = position;
    }

    get dirty() {
        return(this._dirty);
    }

    set dirty(isDirty) {
        this._dirty = isDirty;
    }

    get analysis() {
        return(this._analysis);
    }

    set analysis(data) {
        this._analysis = data;
    }

    /**
     * Count number of characters in text
     * @returns character count
     */
    characterCount() {
        return(this.rawText.length);
    }

    /**
     * Count number of punctuation characters in text
     * @returns punctuation character count
     */
    punctuationCount() {
        return((this.rawText.match(Sentence.PUNCTUATION_RE) || []).length);
    }

    /**
     * Count number of whitespace characters in text
     * @returns whitespace count
     */
    whitespaceCount() {
        return((this.rawText.match(/\s/g) || []).length);
    }

    /**
     * Count number of words in text
     * @returns word count
     */
    wordCount() {
        let trimmed = this.rawText.trim();
        return(trimmed != "" ? trimmed.split(/\s+/).length : 0);
    }

    /**
     * Count number of syllables in text
     * @returns syllable count
     */
    syllableCount() {
        return(syllable(this.rawText.toLocaleLowerCase(LOCALE_LANG)));
    }

    /**
     * Count number of polysyllables in text
     * @returns polysyllable count
     */
    polySyllableCount() {
        let trimmed = this.rawText.toLocaleLowerCase(LOCALE_LANG).trim();
        return(trimmed != "" ? trimmed.split(/\s+/).filter(w => syllable(w) >= 3).length : 0);
    }

    /**
     * Complexity calculated via simplified SMOG index (https://readable.com/readability/smog-index/)
     * @returns 
     */
    isComplex() {

        console.group("isComplex()");
        console.log("Check", JSON.parse(JSON.stringify(this)), "is complex");

        let smog = 3.0 + Math.sqrt(this.polySyllableCount());

        console.log("SMOG index", smog, "complex", smog >= COMPLEXITY_THRESHOLD);
        console.groupEnd();

        return(smog >= COMPLEXITY_THRESHOLD);
    }

    /**
     * Return information string low|middle|high if position contained in sentence, false otherwise
     * @param {int} pos 
     * @returns String|boolean
     */
    containsTextPosition(pos) {

        console.group("containsTextPosition()");
        console.log("Check", JSON.parse(JSON.stringify(this)), "contains position", pos);

        let containment = false;
        if (this.parentEnd == pos) {
            containment = "high";
        } else if (this.parentStart == pos) {
            containment = "low"
        } else if (pos > this.parentStart && pos < this.parentEnd) {
            containment = "middle";
        }

        console.log("Containment", containment);
        console.groupEnd();
        
        return(containment);
    }

}
