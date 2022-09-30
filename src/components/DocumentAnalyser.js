import * as React from 'react';
import { Grid, List } from '@mui/material';
import { Box, ButtonGroup, Button } from '@mui/material';
import TextModel from '../assets/readability/TextModel';
import * as Panel from '../assets/readability/PanelItems';
import * as Toolbar from '../assets/readability/EditorToolbarItems';
import { highlightingStyles, toolbar, toolButtonActive, toolButtonInactive } from '../assets/readability/Styles';
import { CompositeDecorator, Editor, EditorState, RichUtils } from 'draft-js';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import 'tippy.js/themes/material.css';

const EditorToolbar = (props) => {

    console.group('EditorToolbar() renderer');

    let { getEditorState, onChange } = props;
    let editorState = getEditorState();
    let selection = editorState.getSelection();
    let blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    let currentStyle = editorState.getCurrentInlineStyle();
    console.log('editor state', editorState, 'selection', selection, 'block type', blockType, 'current style', currentStyle);

    console.groupEnd();

    return (
        <Box sx={toolbar}>
            <ButtonGroup sx={{ borderRadius: 0 }}>
                {Toolbar.editorToolbarItems.map((eti) => {
                    let active = eti.type == 'block' ? (eti.style === blockType) : (currentStyle.has(eti.style));                  
                    return(
                        <Button 
                            variant="text" 
                            sx={active ? toolButtonActive : toolButtonInactive}
                            key={eti.key}
                            value={eti.value} 
                            title={eti.title}
                            type={eti.type}
                            onClick={ (evt) => {

                                let btn = evt.target.closest('button');

                                console.group('onClick() handler for toolbar button', btn);

                                let currentEditorState = getEditorState(), newEditorState = null;                                
                                btn.classList.toggle('editorToolbarActive');
                                let isBlock = btn.getAttribute('type') == 'block';
                                if (isBlock) {
                                    console.log('Block type');
                                    newEditorState = RichUtils.toggleBlockType(currentEditorState, blockType);
                                } else {
                                    console.log('Inline type');
                                    newEditorState = RichUtils.toggleInlineStyle(currentEditorState, currentStyle);
                                }

                                console.log('Calling onChange() with new state', newEditorState);
                                onChange(newEditorState);

                                console.groupEnd();
                            }} 
                        >
                        { typeof eti.text == 'string' ? eti.text : eti.icon }
                        </Button>)
                })}                                
            </ButtonGroup>            
        </Box>
    );
};

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

        /* Cope with some of the issues described in https://github.com/facebook/draft-js/issues/403 - loading Draft.css was impractical here */
        this.editor.current.focus();
        document.querySelector('div.DraftEditor-root').addEventListener('click', () => {
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
        if (id == 'includeMedicalTerms') {
            /* Update the SMOG index metric */
            const smog = this.textModel.smogIndex(!checked);
            this.setState({ 'readability': {
                readingTime: this.textModel.averageReadingTime(),
                smogIndex: smog,
                ukReadingAge: this.textModel.toUKReadingAge(smog)
            }});      
        } else {
            /* Update inline styles representing complexity and chosen terms */
            let newEditorState = EditorState.createWithContent(this.state.editorState.getCurrentContent(), this.getDecorators());
            this.setState({editorState: EditorState.push(newEditorState, newEditorState.getCurrentContent(), 'change-inline-style')});
        }        
    }

    onToolbarStateChange(newState) { 
        console.log('onToolbarStateChange()', newState, 'selection', newState.getSelection());
        this.setState({editorState: EditorState.push(newState, newState.getCurrentContent(), 'change-inline-style')});
        // console.log('onToolbarStateChange() : existing', this.state.toolButtonStates, 'new', newFormats);
        // let turnedOff = newFormats.filter(x => !this.state.toolButtonStates.includes(x));
        // let turnedOn = this.state.toolButtonStates.filter(x => !newFormats.includes(x));
        // let btnName = null;
        // if (turnedOff.length > 0) {
        //     /* Button toggled off */
        //     btnName = turnedOff[0];
        // } else if (turnedOn.length > 0) {
        //     /* Button toggled off */
        //     btnName = turnedOn[0];
        // }
        // let style = toolButtonStyles[btnName];
        // console.log('Selection before:', this.state.editorState.getSelection());
        // let newEditorState = RichUtils.toggleInlineStyle(this.state.editorState, style);
        // console.log('Selection after:', newEditorState.getSelection());
        // this.setState({editorState: EditorState.push(newEditorState, newEditorState.getCurrentContent(), 'change-inline-style')});
        // console.log('Selection after 2:', newEditorState.getSelection());
        // console.log('Current inline style', newEditorState.getCurrentInlineStyle());
        // if (style) {
        //     let selection = this.state.editorState.getSelection();
        //     let newContentState = null;
        //     if (addStyle) {
        //         newContentState = Modifier.applyInlineStyle(this.state.editorState.getCurrentContent(), selection, style);
        //     } else {
        //         newContentState = Modifier.removeInlineStyle(this.state.editorState.getCurrentContent(), selection, style);
        //     }
        //     let newEditorState = EditorState.createWithContent(newContentState, this.getDecorators());
        //     newEditorState = EditorState.forceSelection(newEditorState, selection);
        //     this.setState({editorState: EditorState.push(newEditorState, newContentState, 'change-inline-style')});
        // }
        //this.setState({toolButtonStates: newFormats});
    }

    onStateChange(newState) {

        console.group('onStateChange()');
        console.log('Selection on enter onStateChange():', newState.getSelection());

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
                ukReadingAge: this.textModel.toUKReadingAge(smog)
            }});     
        }
        
        console.groupEnd();
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={9}>
                    <Panel.WhitePaper elevation={5}>  
                        <EditorToolbar
                            getEditorState={ () => this.state.editorState }
                            onChange={ this.onToolbarStateChange.bind(this) }
                        />
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