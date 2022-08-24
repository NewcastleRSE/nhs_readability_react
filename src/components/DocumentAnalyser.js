import * as React from 'react';
import { Grid, List } from '@mui/material';
import TextModel from '../assets/readability/TextModel';
import * as Panel from '../assets/readability/PanelItems';
import { highlightingStyles } from '../assets/readability/Styles';
import { CompositeDecorator, Editor, EditorState } from 'draft-js';
import tippy from 'tippy.js';
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import 'tippy.js/themes/material.css';

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
                nSyllables: 0,
                nPolySyllables: 0,
                nSentences: 0,
                nParagraphs: 0
            },
            readability: {
                readingTime: 0,
                smogIndex: 0,
                ukReadingAge: 0
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
        const complexStyle = this.state.switches['showComplexSentences'] ? highlightingStyles['showComplexSentences'] : highlightingStyles['normalText'];
        const prismStyle = this.state.switches['highlightPrismWords'] ? highlightingStyles['highlightPrismWords'] : highlightingStyles['normalText'];
        return(new CompositeDecorator([
            {
                strategy: function(contentBlock, callback, contentState) { this.textModel.findComplexSentences(...arguments) }.bind(this),
                component: (props) => {
                    return ( <span style={complexStyle} data-offset-key={props.offsetKey}>{props.children}</span>)
                }
            }, {
                strategy: function(contentBlock, callback, contentState) { this.textModel.findPrismWords(...arguments) }.bind(this),
                component: (props) => {
                    return ( <span style={prismStyle} data-offset-key={props.offsetKey}>{props.children}</span>)
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
            editorRoot.querySelector('div.public-DraftEditorPlaceholder-root').style.display = 'none';
            this.editor.current.focus();
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
        let newEditorState = EditorState.createWithContent(this.state.editorState.getCurrentContent(), this.getDecorators());
        this.setState({editorState: EditorState.push(newEditorState, newEditorState.getCurrentContent(), 'change-inline-style')});
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={9}>
                    <Panel.WhitePaper elevation={5}>
                        <Editor
                            ref={ this.editor }
                            placeholder='&nbsp;Type or paste your document here'
                            editorState={ this.state.editorState }
                            onChange={ (newState) => {
                                this.setState({ 'editorState': this.textModel.stateUpdate(newState, this.state.switches) } );
                                /* Set basic document metrics */
                                this.setState({ 'metrics': this.textModel.getMetrics() });
                                /* Set readability metrics */
                                const smog = this.textModel.smogIndex();
                                this.setState({ 'readability': {
                                    readingTime: this.textModel.averageReadingTime(),
                                    smogIndex: smog,
                                    ukReadingAge: this.textModel.toUKReadingAge(smog)
                                }});                                                                          
                            } }                            
                        />                  
                    </Panel.WhitePaper>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    <Panel.WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={<Panel.PanelListSubheader caption="Document Analysis Options" />}>
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
                        <List sx={{ width: '100%' }} subheader={<Panel.PanelListSubheader caption="Current Document Metrics" />}>
                            {Panel.metricListItems.map((mli) => (
                                <Panel.MetricListItem key={mli.key} id={mli.id} primary={mli.primary} help={mli.help} value={this.state.metrics[mli.id]} />
                            ))}
                        </List>
                    </Panel.WhitePaper>
                    <Panel.WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={<Panel.PanelListSubheader caption="Readability Metrics" />}>
                            {Panel.readabilityListItems.map((rli) => (
                                <Panel.MetricListItem key={rli.key} id={rli.id} primary={rli.primary} help={rli.help} value={this.state.readability[rli.id]} />
                            ))}
                        </List>
                    </Panel.WhitePaper>
                </Grid>
            </Grid>
        );
    }
}