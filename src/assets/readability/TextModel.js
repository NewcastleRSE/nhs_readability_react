/**
* @module TextModel
*/

import { syllable } from 'syllable';
import pluralize from 'pluralize';
import easyWords from './EasyWords';
import { ContentState, EditorState } from 'draft-js';

const LOCALE_LANG = "en-UK";

const INITIALISER = {
    nCharacters: 0,
    nSpaces: 0,
    nPunctuation: 0,
    nSyllables: 0,
    nPolySyllables: 0,
    nWords: 0
};

/* Punctuation if '?' or '!' or '.' where not part of a floating point number of section number (e.g. 1.2.11) */
const PUNCTUATION_RE = /[?!]+|(?<!\d+)\.(?!\d+)/g;

/* Conversion from US grade level to UK reading age */
const UK_READING_AGE_CORRECTION = 5;

/** 
 * @classdesc Class to model text a sequence of queryable sentences
 */
export default class TextModel {

    constructor(initialText = '') {
        let state = EditorState.createEmpty();
        if (initialText != '') {
            state = EditorState.createWithContent(ContentState.createFromText(initialText));
        }
        Object.assign(this, INITIALISER, {
            lang: LOCALE_LANG,
            editorState: state,           
            easyWordSet: new Set(easyWords)            
        });
    }

    update(newEditorState) {

        console.group('update()');
        console.log('New editor state:\n', newEditorState);

        let changeType = newEditorState.getLastChangeType();
        switch(changeType) {
            case 'adjust-depth':
            case 'apply-entity':
            case 'change-block-data':
            case 'change-block-type':
            case 'change-inline-style':
                /* No changes to actual text have occurred */
                console.log('Change type', changeType, 'means no text changes have occurred');
                break;
            default:
                /* Text changes may have occurred */
                const currentContentState = this.editorState.getCurrentContent();
                const newContentState = newEditorState.getCurrentContent();
                if (currentContentState != newContentState) {
                    /* Content has changed => update all metrics */
                    Object.assign(this, INITIALISER);
                    newContentState.getBlockMap().forEach(bm => {
                        let blockText = bm.getText();
                        this.nCharacters += this.characterCount(blockText);
                        this.nSpaces += this.whitespaceCount(blockText);
                        this.nWords += this.wordCount(blockText);
                        this.nSyllables += this.syllableCount(blockText);
                        this.nPolySyllables += this. polySyllableCount(blockText);
                    });
                } else {
                    console.log('Content state has not changed');
                }
                break;
        }
        this.editorState = newEditorState;
            
        console.groupEnd();   
    }

    /**
     * Count number of characters in text
     * @param {String} text
     * @returns character count
     */
    characterCount(text) {
        return(text.length);
    }

    /**
     * Count number of punctuation characters in text
     * @param {String} text
     * @returns punctuation character count
     */
    punctuationCount(text) {
        return((text.match(PUNCTUATION_RE) || []).length);
    }

    /**
     * Count number of whitespace characters in text
     * @param {String} text
     * @returns whitespace count
     */
    whitespaceCount(text) {
        return((text.match(/\s/g) || []).length);
    }

    /**
     * Count number of words in text
     * @param {String} text
     * @returns word count
     */
    wordCount(text) {
        let trimmed = text.trim();
        return(trimmed != "" ? trimmed.split(/\s+/).length : 0);
    }

    /**
     * Count number of syllables in text
     * @param {String} text
     * @returns syllable count
     */
    syllableCount(text) {
        return(syllable(text.toLocaleLowerCase(LOCALE_LANG)));
    }

    /**
     * Count number of polysyllables in text
     * @param {String} text
     * @returns polysyllable count
     */
    polySyllableCount(text) {
        let trimmed = text.toLocaleLowerCase(LOCALE_LANG).trim();
        return(trimmed != "" ? trimmed.split(/\s+/).filter(w => syllable(w) >= 3).length : 0);
    }

    // {
    //     const newContentState = newState.getCurrentContent();                                
    //     const currentContentState = this.state.editorState.getCurrentContent();
    //     if (currentContentState != newContentState) {
    //         console.log('Content has changed!');
    //         console.log('Old:\n', currentContentState.getPlainText(), '\nNew:\n', newContentState.getPlainText());
    //         console.dir(newContentState.getBlockMap());
    //         newContentState.getBlockMap().forEach(bm => {
    //             console.log(bm.getKey(), bm.getType(), bm.getLength(), bm.getText());
    //             console.dir(bm.getCharacterList());
    //         });
    //         this.setState({ editorState: newState });
    //     } else {
    //         console.log('Content has NOT changed!');
    //     }
    // }

    /**
     * Round a floating point number to 'dp' decimal places
     * @param {float} num 
     * @param {int} dp 
     */
    _roundFloat(num, dp = 2) {
        let conversion = Math.pow(10, dp);
        return(Math.round((num + Number.EPSILON) * conversion) / conversion);
    }
    
    /**
     * Count characters in current text
     * @param {boolean} ignoreSpaces 
     * @returns number of characters in text
     */
    charCount(ignoreSpaces = false) {
        return(this.nCharacters - (ignoreSpaces ? this.nSpaces : 0));
    }

    /**
     * Count number of letters in current text
     * @param {boolean} ignoreSpaces 
     * @returns number of letters in text
     */
    letterCount(ignoreSpaces = true) {
        return(this.nCharacters - this.nPunctuation - (ignoreSpaces ? this.nSpaces : 0));
    }

    /**
     * Count number of punctuation characters in current text
     * @returns number of punctuation characters
     */
    punctuationCount() {
        return(this.nPunctuation);
    }

    /**
     * Count words in current text
     * @returns number of words
     */
    lexiconCount() {        
        return(this.nWords);
    }
    
    /**
     * Count number of syllables in current text
     * @returns number of syllables in text
     */
    syllableCount() {
        return(this.nSyllables);       
    }

    /**
     * Count number of sentences in current text
     * @returns number of sentences
     */
    sentenceCount() {       
        return(this.sentences.length);    
    }

    /**
     * Compute average length of sentences in current text
     * @returns average sentence length
     */
    averageSentenceLength() {
        let asl = 0;
        let nWords = this.lexiconCount();
        let nSents = this.sentenceCount();
        if (nWords != 0 && nSents != 0) {
            asl = this._roundFloat((nWords / nSents), 1);
        }
        return(asl);
    }

    /**
     * Compute average number of syllables per word in current text
     * @returns average number of syllables per word
     */
    averageSyllablesPerWord() {
        let syllablesPerWord = 0;
        let nSyllables = this.syllableCount();
        let nWords = this.lexiconCount();
        if (nSyllables != 0 && nWords != 0) {
            syllablesPerWord = this._roundFloat((nSyllables / nWords), 1);
        }
        return(syllablesPerWord);
    }

    /**
     * Compute average number of characters per word in current text
     * @returns 
     */
    averageCharacterPerWord() {
        let charactersPerWord = 0;
        let nChars = this.charCount();
        let nWords = this.lexiconCount();
        if (nChars != 0 && nWords != 0) {
            charactersPerWord = this._roundFloat((nChars / nWords), 2);
        }
        return(charactersPerWord);
    }

    /**
     * Compute average number of letters per word in current text
     * @returns average letters per word
     */
    averageLettersPerWord() {
        let lettersPerWord = 0;
        let nLetts = this.letterCount();
        let nWords = this.lexiconCount();
        if (nLetts != 0 && nWords != 0) {
            lettersPerWord = this._roundFloat((nLetts / nWords), 2);
        }
        return(lettersPerWord);
    }

    /**
     * Compute average number of sentences per word in current text
     * @returns average sentences per word
     */
    averageSentencesPerWord() {
        let sentencesPerWord = 0;
        let nSents = this.sentenceCount();
        let nWords = this.lexiconCount();
        if (nSents != 0 && nWords != 0) {
            sentencesPerWord = this._roundFloat((nSents / nWords), 2);
        }
        return(sentencesPerWord);
    }

    /**
     * Count number of polysyllabic words in current text
     * @returns polysyllable count
     */
     polySyllableCount() {
        return(this.nPolySyllables);    
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
            ukra = this._roundFloat(grade + UK_READING_AGE_CORRECTION, 2);
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
        let sentences = this.sentenceCount();
        if (sentences >= 3) {
            let polySyllab = this.polySyllableCount();
            smog = this._roundFloat(1.043 * (30 * (polySyllab / sentences)) ** 0.5 + 3.1291, 1);            
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
        let nChars = this.charCount();
        let nWords = this.lexiconCount();
        let nSents = this.sentenceCount();

        let avCharsPerWord = nWords == 0 ? 0 : nChars / nWords;
        let avWordsPerSentence = nSents == 0 ? 0 : nWords / nSents;
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
        let ret = {
            easy: 0,
            difficult: 0,
            sentences: 0
        };
        let nProcessed = 0;
        for (let i = 0; i < this.sentences.length && nProcessed < sampleSize; i++) {
            let sentence = this.sentences[i];            
            let sentenceWords = sentence.rawText.toLocaleLowerCase(this.lang).split(/\s/);
            if (nProcessed + sentenceWords.length > sampleSize) {
                /* Reduce the last list before finishing */
                sentenceWords = sentenceWords.slice(0, sampleSize - nProcessed);
            }
            ret.difficult += (sentenceWords.filter(w => syllable(w) >= syllableThreshold)).length;
            ret.easy += (sentenceWords.length - ret.difficult);
            ret.sentences = i;
            nProcessed += sentenceWords.length;
        }
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
     * Good guess at the present temnse of a verb
     * @param {String} word 
     * @returns present tense of verb
     */
    presentTense(word) {
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
        this.sentences.forEach(sentence => {
            let sentenceWords = sentence.rawText.split(/\s/);
            ret.total += sentenceWords.length;
            sentenceWords.forEach(word => {
                let normalised = this.presentTense(pluralize(word.toLocaleLowerCase(), 1));
                if (!this.easyWordSet.has(normalised) && syllable(word >= syllableThreshold)) {
                    ret.difficult++;
                }
            });
        });
        return(ret);
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

}