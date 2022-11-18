import * as React from 'react';
import { Grid, List } from '@mui/material';
import TextModel from '../assets/readability/TextModel';
import * as Panel from '../assets/readability/PanelItems';
import { highlightingStyles } from '../assets/readability/Styles';
import Button from '@mui/material/Button';
import { CompositeDecorator, Editor, EditorState, SelectionState, Modifier } from 'draft-js';
import tippy from 'tippy.js';
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import 'tippy.js/themes/material.css';
import { prismWords } from '../assets/readability/PrismWords';

export default class DocumentAnalyser extends React.Component {

    constructor(props) {
        super(props);            
        this.state = {
            editorState: EditorState.createEmpty(),
            switches: {
                showComplexSentences: Panel.getSwitchByName('showComplexSentences').defaultChecked,
                highlightPrismWords: Panel.getSwitchByName('highlightPrismWords').defaultChecked,
                includeMedicalTerms: Panel.getSwitchByName('includeMedicalTerms').defaultChecked
            },
            metrics: {
                nCharacters: 0,
                nSpaces: 0,
                nPunctuation: 0,
                nWords: 0,
                avWordsPerSentence: 0,
                nSyllables: 0,
                nPolySyllables: 0,
                nSentences: 0,
                avSentencesPerParagraph: 0,
                nParagraphs: 0
            },
            readability: {
                readingTime: 0,
                smogIndex: 0,
                ukReadingAge: 0,
                fleschKincaid: 0,
                includeMedicalTerms: Panel.getSwitchByName('includeMedicalTerms').defaultChecked
            }
        };
        this.editor = React.createRef();
        this.textModel = new TextModel(this.state.switches);              
    }

    /**
     * Return the required list of decorators based on switch settings
     * @returns CompositeDecorator
     */
    getDecorators() {
        const showComplex = this.state.switches['showComplexSentences'];
        const complexStyle = showComplex ? highlightingStyles['showComplexSentences'] : highlightingStyles['normalText'];
        const showPrism = this.state.switches['highlightPrismWords'];
        const prismStyle = showPrism ? highlightingStyles['highlightPrismWords'] : highlightingStyles['normalText'];
        return(new CompositeDecorator([
            {
                strategy: function(contentBlock, callback, contentState) { this.textModel.findComplexSentences(...arguments) }.bind(this),
                component: (props) => {
                    return ( <span className={showComplex ? "sentence-is-complex" : ""} style={complexStyle} data-offset-key={props.offsetKey}>{props.children}</span> )
                }
            }, {
                strategy: function(contentBlock, callback, contentState) { this.textModel.findPrismWords(...arguments) }.bind(this),
                component: (props) => {
                    console.debug('Re-rendering prism word', props);
                    return ( 
                        <span 
                            className={showPrism ? "prism-word" : ""} 
                            style={prismStyle} 
                            data-anchor-offset={props.start} 
                            data-focus-offset={props.end} 
                            data-offset-key={props.offsetKey}
                        >{props.children}</span>)
                }
            }
        ]));
    }

    componentDidMount() {        
        
        this.setState({ 'editorState': EditorState.createEmpty(this.getDecorators()) });

        /* Settings for tooltips */     
        tippy.setDefaultProps({
            theme: 'material',
            arrow: true,
            delay: [200, 200],
            allowHTML: true,
            interactive: true,
            maxWidth: '20rem'
        });
        tippy('[data-tippy-content]');

        /* Enable click anywhere in editor to give focus initially - eliminates unintuitive behaviour which focusses only on click over placeholder text */
        const editorRoot = document.querySelector('div.DraftEditor-root');
        editorRoot.addEventListener('click', () => {
            const phRoot = editorRoot.querySelector('div.public-DraftEditorPlaceholder-root');
            phRoot && (phRoot.style.display = 'none');
            this.editor.current.focus();
        });
    }

    componentDidUpdate() {

        /* Highlighting housekeeping */
        let edContents = document.querySelector('div[data-contents]');
        Array.from(edContents.querySelectorAll('span.prism-word')).forEach(spw => {
            let blockKey = spw.dataset.offsetKey.substring(0, 5);
            let blockAnchorOffset = spw.dataset.anchorOffset;
            let blockFocusOffset = spw.dataset.focusOffset;
            console.debug('Highlighted word', spw.innerText, 'block key', blockKey, 'anchor offset', blockAnchorOffset, 'focus offset', blockFocusOffset);
            let alts = prismWords[spw.innerText.toLowerCase()];
            if (alts) {
                /* Add tooltip indicating alternative words/phrases */
                let tipFrag = document.createDocumentFragment();
                alts.forEach(alt => {
                    let replace = document.createElement('a');
                    replace.href = 'javascript:void(0)';
                    replace.title = 'Replace highlighted word with this one';
                    replace.text = alt;
                    replace.style.cursor = 'pointer';
                    replace.addEventListener('click', evt => {
                        let blockSelection = SelectionState.createEmpty(blockKey).merge({
                            anchorOffset: blockAnchorOffset,
                            focusOffset: blockFocusOffset
                        });
                        let contentState = Modifier.replaceText(this.state.editorState.getCurrentContent(), blockSelection, alt);
                        this.setState({editorState: EditorState.push(this.state.editorState, contentState, null)});
                    });                    
                    tipFrag.appendChild(replace);
                    tipFrag.appendChild(document.createElement('br'));
                });
                tippy(spw, {
                    theme: 'teal',
                    content: tipFrag,
                    allowHTML: true
                });
            }
        });
    }

    /**
     * Handler for a switch change
     * @param {Event} evt 
     */
    onSwitchChange(evt) {
        const { id, checked } = evt.target;
        let currentSwitchState = this.state.switches;
        currentSwitchState[id] = checked;
        this.setState({'switches': currentSwitchState});
        console.log('Updated switch state', this.state.switches, 'editor state', this.state.editorState);
        this.textModel.switchStateUpdate(id, checked);

        /* if prismWords or complexSentences switch is on, the other must be off 
          switches not updating */

        if (id == 'highlightPrismWords' && checked == true) {
            this.textModel.switchStateUpdate('showComplexSentences', false);
            //Panel.getSwitchByName('showComplexSentences').checked = false;
            Panel.getSwitchByName('showComplexSentences').defaultChecked = false;
        }
        else if (id == 'showComplexSentences' && checked == true) {
            this.textModel.switchStateUpdate('highlightPrismWords', false);
            Panel.getSwitchByName('highlightPrismWords').checked = false;
        }
            
        if (id == 'includeMedicalTerms') {
            /* Update the SMOG index metric */
            const smog = this.textModel.smogIndex(!checked);
            this.setState({ 'readability': {
                readingTime: this.textModel.averageReadingTime(),
                smogIndex: smog,
                ukReadingAge: this.textModel.toUKReadingAge(smog),
                fleschKincaid: this.textModel.fleschKincaidGrade()

            }});      
        } else {
            /* Update inline styles representing complexity and chosen terms */
            let newEditorState = EditorState.createWithContent(this.state.editorState.getCurrentContent(), this.getDecorators());
            this.setState({editorState: EditorState.push(newEditorState, newEditorState.getCurrentContent(), 'change-inline-style')});
        }        
    }

    onStateChange(newState) {
        console.debug('onStateChange() starting...');
        let textChanged = this.textModel.stateUpdate(newState, this.state.switches);
        this.setState({ 'editorState': this.textModel.getEditorState() } );
        if (textChanged) {
            /* Set basic document metrics */
            this.setState({ 'metrics': this.textModel.getMetrics() });
            /* Set readability metrics */
            const smog = this.textModel.smogIndex();
            this.setState({ 'readability': {
                readingTime: this.textModel.averageReadingTime(),
                smogIndex: smog,
                ukReadingAge: this.textModel.toUKReadingAge(smog),
                fleschKincaid: this.textModel.fleschKincaidGrade()
            }});            
        } 
        console.debug('onStateChange() done');        
    }

    clearStateText(newState) {
       this.setState({ 'editorState': EditorState.createEmpty(this.getDecorators()) });
    }

    render() {
        return ( 
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={9}>
                    <Panel.WhitePaper elevation={5}>
                    <Button sx={{ padding: 1, margin: 1 }} variant="outlined" onClick={this.clearStateText.bind(this)}>Clear text</Button>    
                        <Editor
                            ref={ this.editor }
                            placeholder='&nbsp;Type or paste your document here'
                            editorState={ this.state.editorState }
                            onChange={ this.onStateChange.bind(this) }                           
                        />  
                               
                    </Panel.WhitePaper>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    <Panel.WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={<Panel.PanelListSubheader caption="Readability" />}>
                            {Panel.readabilityListItems.map((rli) => (
                                <Panel.MetricListItem key={rli.key} id={rli.id} primary={rli.primary} help={rli.help} value={this.state.readability[rli.id]} />
                            ))}
                             {Panel.readabilitySwitchItems.map((rsi) => (
                                <Panel.ReadabilitySwitchItem 
                                    key={rsi.key} 
                                    id={rsi.id} 
                                    primary={rsi.primary} 
                                    help={rsi.help} 
                                    defaultChecked={rsi.defaultChecked} 
                                    onChange={this.onSwitchChange.bind(this)} />
                            ))}
                        </List>
                    </Panel.WhitePaper>
                    <Panel.WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={<Panel.PanelListSubheader caption="Analysis Options" />}>
                            {Panel.switchListItems.map((sli) => (
                                <Panel.SwitchListItem 
                                    key={sli.key} 
                                    id={sli.id} 
                                    primary={sli.primary} 
                                    help={sli.help} 
                                    defaultChecked={sli.defaultChecked} 
                                    onChange={this.onSwitchChange.bind(this)} />
                            ))}
                        </List>
                    </Panel.WhitePaper>
                    <Panel.WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={<Panel.PanelListSubheader caption="Metrics" />}>
                            {Panel.metricListItems.map((mli) => (
                                <Panel.MetricListItem key={mli.key} id={mli.id} primary={mli.primary} help={mli.help} value={this.state.metrics[mli.id]} />
                            ))}
                        </List>
                    </Panel.WhitePaper> 
                    <Panel.WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={<Panel.PanelListSubheader/>}>
                            <Button sx={{ padding: 1, margin: 1 }} variant="outlined" onClick={this.clearStateText.bind(this)}>Clear text</Button> 
                        </List>    
                    </Panel.WhitePaper>                   
                </Grid>
            </Grid>
        );
    }
}