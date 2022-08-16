import MUIRichTextEditor from 'mui-rte';
import * as React from 'react';
import { Grid, List } from '@mui/material';
import TextModel from '../assets/readability/TextModel';
import * as Panel from '../assets/readability/PanelItems';
import tippy from 'tippy.js';
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import 'tippy.js/themes/material.css';
import { EditorState } from 'draft-js';

export default class DocumentAnalyser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {            
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
        this.textModel = new TextModel();
    }
    componentDidMount() {
        EditorState.createEmpty();
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
        document.querySelector('div#mui-rte-root').addEventListener('click', () => this.editor.current.focus());

    }
    onSwitchChange(evt) {
        let currentSwitchState = this.state.switches;
        currentSwitchState[evt.target.id] = evt.target.checked;
        this.setState({'switches': currentSwitchState});
        console.log('Current switch state', this.state.switches);
    }
    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={9}>
                    <Panel.WhitePaper elevation={5}>
                        <MUIRichTextEditor
                            ref={ this.editor }
                            label='&nbsp;Type or paste document here'
                            inlineToolbar={true}
                            onChange={ (newState) => {
                                this.textModel.stateUpdate(newState, this.state.switches);
                                /* Set basic document metrics */
                                this.setState({ 'metrics': this.textModel.getMetrics() });
                                /* Set readability metrics */
                                const smog = this.textModel.smogIndex();
                                this.setState({'readability': {
                                    readingTime: this.textModel.averageReadingTime(),
                                    smogIndex: smog,
                                    ukReadingAge: this.textModel.toUKReadingAge(smog)
                                }});
                            } }
                            onFocus={ () => { console.log('Focus') } }
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