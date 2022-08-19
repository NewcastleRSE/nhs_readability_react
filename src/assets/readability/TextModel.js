/**
 * @module TextModel
 */

import { syllable } from 'syllable';
import pluralize from 'pluralize';
import { localeLang, easyWords, ukReadingAgeCorrection, averageReadingWordsPerMinute } from './Constants';
import { EditorState } from 'draft-js';
import ParagraphRecord from './ParagraphRecord';

/* Document-level counts */
const GLOBAL_COUNT_INITIALISER = {
    nCharacters: 0,
    nSpaces: 0,
    nPunctuation: 0,
    nWords: 0,
    nSyllables: 0,
    nPolySyllables: 0,
    nSentences: 0,
    nParagraphs: 0
};

/** 
 * @classdesc Class to model text a sequence of queryable sentences
 */
export default class TextModel {

    /**
     * Creates analysis record of paragraph text indexed by ContentBlock key, containing individual StateRecords
     * @param {Object} switchState initial switch values { <switch_name1>: t|f, <switch_name2>: t|f,... }
     */
    constructor(switchState = {}) {
        let highlightState = {};
        for (let name in switchState) {
            highlightState[name] = {
                switchState: switchState[name],
                highlightEntity: null
            }
        }
        Object.assign(this, GLOBAL_COUNT_INITIALISER, {            
            lang: localeLang,
            editorState: null,  
            modelState: {},
            highlightState: highlightState,
            easyWordSet: new Set(easyWords)            
        });        
    }

    /**
     * Update the text model state based on a new EditorState
     * @param {EditorState} newEditorState
     */
    stateUpdate(newEditorState) {

        console.group('stateUpdate()');
        console.log('New editor state:\n', newEditorState);

        let changeType = newEditorState.getLastChangeType();
        switch(changeType) {

            case null:
            case 'adjust-depth':
            case 'apply-entity':
            case 'change-block-data':
            case 'change-block-type':
            case 'change-inline-style':
                /* No changes to actual text have occurred */
                console.log('Change type', changeType, '=> no text changes have occurred');
                break;

            default:
                /* Text changes may have occurred */
                console.log('Change type', changeType, '=> further checks for text changes required');
                const currentContentState = this._getCurrentEditorContent();
                let newContentState = newEditorState.getCurrentContent();

                /* Create persistent entities for the highlighting */
                for (let name in this.highlightState) {
                    if (this.highlightState[name].highlightEntity == null) {
                        newContentState = newContentState.createEntity(name, 'MUTABLE', name);
                        this.highlightState[name].highlightEntity = newContentState.getLastCreatedEntityKey();
                    }
                }

                if (currentContentState != newContentState) {  

                    /* Recompute all global counts */
                    Object.assign(this, GLOBAL_COUNT_INITIALISER);
                    let liveKeys = [];

                    /* Content has changed => update all metrics */
                    console.log('Text changes have occurred');
                    newContentState.getBlockMap().forEach(block => {

                        /* Determine if existing paragraph record for this block */
                        let blockKey = block.getKey();
                        this.modelState[blockKey] = this.modelState[blockKey] || new ParagraphRecord();     
                        const paraRecord = this.modelState[blockKey];                   
                        paraRecord.stateUpdate(block, this.highlightState);

                        /* draft-js will create paragraphs containing a single carriage return, not very useful */
                        if (!this.modelState[blockKey].isNullParagraph()) {                            
                            /* Update basic metrics */                            
                            this.nCharacters += paraRecord.nChars;
                            this.nSpaces += paraRecord.nSpaces;
                            this.nPunctuation += paraRecord.nPunctuation;
                            this.nWords += paraRecord.wordCount(1);
                            this.nSyllables += paraRecord.syllableCount();
                            this.nPolySyllables += paraRecord.wordCount(3);
                            this.nSentences += paraRecord.getSentences().length;
                            this.nParagraphs++;
                        }                        
                        liveKeys.push(blockKey);
                    });

                    console.log('Model state', this.modelState);
                    console.log('Currently live block keys', liveKeys);

                    /* Delete all paragraph records for dead blocks */
                    console.log('Cleaning up dead block keys...');
                    Object.keys(this.modelState).forEach(k => {
                        if (!liveKeys.includes(k)) {
                            console.log('Key', k, 'is dead - removing');
                            delete this.modelState[k];
                        }
                    });
                    console.log('Finished');
                } else {
                    console.log('Content state has not changed');
                }
                break;
        }

        this.editorState = newEditorState;
            
        console.dir('Updated model:\n', this);
        console.groupEnd();   
    }

    /**
     * Act on change to switch state
     * @param {String} switchName
     * @param {boolean} switchValue
     */
    switchStateUpdate(switchName, switchValue) {
        this.switchState[switchName] = switchValue;

    }

    /**
     * Extract model properties representing count metrics
     * Thanks to https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties for the elegant
     * way of doing this, rather than the usual loop
     * @returns Object containing metric data
     */
    getMetrics() {
        return((
            ({ nCharacters, nSpaces, nPunctuation, nWords, nSyllables, nPolySyllables, nSentences, nParagraphs }) => 
            ({ nCharacters, nSpaces, nPunctuation, nWords, nSyllables, nPolySyllables, nSentences, nParagraphs }))(this)
        );
    }

    forAllSentences(callback) {
        for (const prec of Object.values(this.modelState)) {
            if (!prec.forAllSentences(callback)) {
                return(false);
            }
        }
        return(true);
    }
    
    /**
     * Compute average length of sentences in current text
     * @returns average sentence length
     */
    averageSentenceLength() {
        let asl = 0;       
        if (this.nWords != 0 && this.nSentences != 0) {
            asl = this._roundFloat((this.nWords / this.nSentences), 1);
        }
        return(asl);
    }

    /**
     * Compute average number of syllables per word in current text
     * @returns average number of syllables per word
     */
    averageSyllablesPerWord() {
        let syllablesPerWord = 0;      
        if (this.nSyllables != 0 && this.nWords != 0) {
            syllablesPerWord = this._roundFloat((this.nSyllables / this.nWords), 1);
        }
        return(syllablesPerWord);
    }

    /**
     * Compute average number of characters per word in current text
     * @returns 
     */
    averageCharacterPerWord() {
        let charactersPerWord = 0;     
        if (this.nCharacters != 0 && this.nWords != 0) {
            charactersPerWord = this._roundFloat((this.nCharacters / this.nWords), 2);
        }
        return(charactersPerWord);
    }

    /**
     * Compute average number of letters per word in current text
     * @returns average letters per word
     */
    averageLettersPerWord() {
        let lettersPerWord = 0;
        let nLetts = this.nCharacters - this.nPunctuation - this.nSpaces;
        if (nLetts != 0 && this.nWords != 0) {
            lettersPerWord = this._roundFloat((nLetts / this.nWords), 2);
        }
        return(lettersPerWord);
    }

    /**
     * Compute average number of sentences per word in current text
     * @returns average sentences per word
     */
    averageSentencesPerWord() {
        let sentencesPerWord = 0;  
        if (this.nSentences != 0 && this.nWords != 0) {
            sentencesPerWord = this._roundFloat((this.nSentences / this.nWords), 2);
        }
        return(sentencesPerWord);
    }

    /**
     * Output a formatted estimated reading time for a document
     * @returns reading time in minutes
     */
    averageReadingTime() {
        let art = 'Unknown';
        const wordsPerSec = averageReadingWordsPerMinute / 60.0;
        let date = new Date(0);
        date.setSeconds(Math.ceil(this.nWords / wordsPerSec));
        let [h, m, s] = date.toISOString().substring(11, 19).split(':').map(c => parseInt(c));
        if (h == 0) {
            /* Minutes/seconds */
            art = `${m} min ${s} sec`;
        } else {
            /* Hours/minutes */
            art = `${h} hr ${m} min`;
        }
        return(art);
    }

    /**
     * Conversion of US grade level to UK reading age
     * @param {float} grade
     * @returns UK reading age
     */
    toUKReadingAge(grade) {
        console.group('toUKReadingAge()');
        let ukra = 'n/a';
        if (grade >= 4) {
            ukra = this._roundFloat(grade + ukReadingAgeCorrection, 2);
        }
        console.debug('UK Reading Age', ukra);
        console.groupEnd();
        return(ukra);
    }

    /**
     * Convert Flesch Reading Ease score to US grade
     * @param {float} score 
     * @returns grade
     */
    fleschReadingEaseToGrade(score) {
        console.group('fleschReadingEaseToGrade()');
        let grade = 16;
        if (score < 100 && score >= 90) {
            grade = 5;
        } else if (score < 90 && score >= 80) {
            grade = 6;
        } else if (score < 80 && score >= 70) { 
            grade = 7; 
        } else if (score < 70 && score >= 60) {
            grade = 8.5;
        } else if (score < 60 && score >= 50) {
            grade = 11;
        } else if (score < 50 && score >= 40) {
            grade = 13;  /* College */
        } else if (score < 40 && score >= 30) {
            grade = 15;
        }
        console.debug('Grade', grade);
        console.groupEnd();
        return(grade);
    }

    /**
     * Flesch reading ease index for current text
     * @returns Flesch reading ease index
     */
    fleschReadingEase() {
        console.group('fleschReadingEase()');
        let flesch = 0.0;
        let sentenceLength = this.averageSentenceLength();
        if (sentenceLength > 0) {
            let syllablesPerWord = this.averageSyllablesPerWord();
            flesch = 206.835 - (1.015 * sentenceLength) - (84.6 * syllablesPerWord);
        }  
        let fre = this._roundFloat(flesch, 2); 
        console.debug('Flesch Reading Ease', fre);
        console.groupEnd();
        return(fre);
    }

    /**
     * Compute Flesch Kincaid score for current text
     * @returns Flesch Kincaid grade score
     */
    fleschKincaidGrade() {
        console.group('fleschKincaidGrade()');
        let flesch = 0.0;
        let sentenceLength = this.averageSentenceLength();
        if (sentenceLength > 0) {
            let syllablesPerWord = this.averageSyllablesPerWord();
            flesch = 0.39 * sentenceLength + 11.8 * syllablesPerWord - 15.59;
        }
        let fkg = this._roundFloat(flesch, 1);
        console.debug('Flesch-Kincaid grade', fkg);
        console.groupEnd();
        return(fkg);
    }
    
    /**
     * Compute SMOG index on current text
     * @returns SMOG index as a US grade
     */
    smogIndex() {
        console.group('smogIndex()');
        let smog = 0.0;
        if (this.nSentences >= 3) {
            smog = this._roundFloat(1.043 * (30 * (this.nPolySyllables / this.nSentences)) ** 0.5 + 3.1291, 1);            
        }
        console.debug('SMOG Index', smog);
        console.groupEnd();
        return(smog);
    }

    /**
     * Compute Coleman-Liau index on current text
     * @returns Coleman-Liau index as a US grade
     */
    colemanLiauIndex() {
        console.group('colemanLiauIndex()');
        let letters = this._roundFloat(this.averageLettersPerWord() * 100, 2);
        let sentences = this._roundFloat(this.averageSentencesPerWord() * 100, 2);
        let cli = this._roundFloat(0.058 * letters - 0.296 * sentences - 15.8, 2);
        console.debug('Coleman-Liau Index', cli);
        console.groupEnd();
        return(cli);
    }

    /**
     * Compute Automated Readability Index for current text
     * @returns Automated Readability Index as a US grade
     */
    automatedReadabilityIndex() {
        console.group('automatedReadabilityIndex()');
        let avCharsPerWord = this.nWords == 0 ? 0 : this.nCharacters / this.nWords;
        let avWordsPerSentence = this.nSentences == 0 ? 0 : this.nWords / this.nSentences;
        let ari = this._roundFloat(
            (4.71 * this._roundFloat(avCharsPerWord, 2)) +
            (0.5 * this._roundFloat(avWordsPerSentence, 2)) -
            21.43
        );
        console.debug('Automated Readability Index', ari);
        console.groupEnd();
        return(ari);        
    }

    /**
     * Callback enumerating easy and difficult (syllables >= 3) words in current text
     * NOTE: used as a callback from linsearWriteFormula()
     * @param {int} sampleSize         -- number of words to sample
     * @param {int} syllableThreshold  -- number of syllable required to be considered 'difficult'
     * @returns 
     */
    _easyAndDifficultWords(sampleSize = 100, syllableThreshold = 3) {
        console.group('_easyAndDifficultWords()');
        console.log('Entering with sample size', sampleSize, 'syllable threshold', syllableThreshold);
        let ret = {
            easy: 0,
            difficult: 0,
            sentences: 0
        };
        let nProcessed = 0;
        this.forAllSentences(s => {
            let sentenceWords = s.getWords();
            let processing = true;
            if (nProcessed + sentenceWords.length > sampleSize) {
                /* Reduce the last list before finishing */
                sentenceWords = sentenceWords.slice(0, sampleSize - nProcessed);
                processing = false;
            }
            ret.difficult += (sentenceWords.filter(w => syllable(w) >= syllableThreshold)).length;
            ret.easy += (sentenceWords.length - ret.difficult);
            ret.sentences++;
            nProcessed += sentenceWords.length;
            return(processing);
        }); 
        console.log('Returning', ret);
        console.groupEnd();       
        return(ret);
    }

    /**
     * Linsear Write formula for current text
     * @param {int} sampleSize  -- number of words to sample (default 100)
     * @returns 
     */
    linsearWriteFormula(sampleSize = 100) {
        console.group('linsearWriteFormula()');
        let { difficult, easy, sentences } = this._easyAndDifficultWords(sampleSize);        
        let number = (easy + difficult * 3) / sentences;
        let lwf = this._roundFloat(number <= 20 ? (number - 2) / 2 : number / 2, 1);
        console.debug('Linsear Write Formula', lwf);
        console.groupEnd();
        return(lwf);
    }

    /**
     * Compute Dale-Chall readability score on current text
     * @returns Dale-Chall readability score
     */
    daleChallReadabilityScore() {
        console.group('daleChallReadbilityScore()');        
        let { total, difficult } = this._daleChallDifficultWords();
        let percentDifficult = total == 0 ? 0 : (100 * (difficult / total));
        let score = (0.1579 * percentDifficult) + (0.0496 * this.averageSentenceLength());
        if (percentDifficult > 5) {
            score += 3.6365;
        }
        let dsrs = this._roundFloat(score, 2);
        console.debug('Dale-Chall Readability Score', dsrs);
        console.groupEnd();
        return(dsrs);        
    }

    /**
     * Compute US grade from D-C score
     * @param {float} score 
     * @returns conversion of score to US grade
     */
    daleChallToGrade(score) {
        console.group('daleChallToGrade()');
        let grade = 16;
        if (score <= 4.9) grade = 4;
        if (score < 5.9) grade = 5;
        if (score < 6.9) grade = 7;
        if (score < 7.9) grade = 9;
        if (score < 8.9) grade = 11;
        if (score < 9.9) grade = 13;
        console.debug('Dale-Chall grade', grade);
        console.groupEnd();
        return(grade);
    }

    /**
     * Compute Gunning Fog index, a US grade level for readability
     * @returns Gunning Fog index
     */
    gunningFog() {
        console.group('gunningFog()');
        let { total, difficult } = this._daleChallDifficultWords(3);
        let percentDifficult = 100 * difficult / total;
        let gfi = this._roundFloat(0.4 * (this.averageSentenceLength() + percentDifficult), 2);
        console.debug('Gunning Fog Index', gfi);
        console.groupEnd();
        return(gfi);
    }

    /**
     * Safe access to current editor state content
     * @returns editor content
     */
    _getCurrentEditorContent() {
        return(this.editorState == null ? null : this.editorState.getCurrentContent());
    }

    /**
     * Good guess at the present tense of a verb
     * @param {String} word 
     * @returns present tense of verb
     */
     _presentTense(word) {
        let present = word;
        if (word.length >= 6) {
            if (word.endsWith('ed')) {
                if (this.easyWordSet.has(word.slice(0, -1))) {
                    /* 'easy' word ending in e */
                    present = word.slice(0, -1); 
                } else {
                    /* Assume we remove 'ed' */
                    present = word.slice(0, -2); 
                }
            }
            if (word.endsWith('ing')) {
                /* E.g. forcing -> force */
                let suffixIngToE = word.slice(0, -3) + 'e';
                if (this.easyWordSet.has(suffixIngToE))
                    present = suffixIngToE;
                else
                    present = word.slice(0, -3);
            }
        }
        return(present);
    }

    /**
     * Dale-Chall readability computation
     * @param {int} syllableThreshold 
     * @returns 
     */
    _daleChallDifficultWords(syllableThreshold = 2) {
        let ret = {
            total: 0,
            difficult: 0
        };
        this.forAllSentences(s => {
            let sentenceWords = s.getWords();
            ret.total += sentenceWords.length;
            sentenceWords.forEach(word => {
                let normalised = this._presentTense(pluralize(word.toLocaleLowerCase(), 1));
                if (!this.easyWordSet.has(normalised) && syllable(word >= syllableThreshold)) {
                    ret.difficult++;
                }
            });
        });        
        return(ret);
    }

    /**
     * Round a floating point number to 'dp' decimal places
     * @param {float} num 
     * @param {int} dp 
     */
    _roundFloat(num, dp = 2) {
        let conversion = Math.pow(10, dp);
        return(Math.round((num + Number.EPSILON) * conversion) / conversion);
    }

}