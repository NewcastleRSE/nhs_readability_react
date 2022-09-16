import * as React from 'react';
import { Grid, List } from '@mui/material';
import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted, FormatListNumbered } from "@mui/icons-material";
import TextModel from '../assets/readability/TextModel';
import * as Panel from '../assets/readability/PanelItems';
import * as Toolbar from '../assets/readability/EditorToolbarItems';
import { darkGrey, lightGrey, highlightingStyles, toolButtonStyles } from '../assets/readability/Styles';
import { CompositeDecorator, Editor, EditorState, RichUtils } from 'draft-js';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import 'tippy.js/themes/material.css';

const EditorToolbarButton = (props) => {
    return (
        <ToggleButton 
            title={ props.title } 
            value={ props.name }
            variant="text" 
            sx={{ width: '40px', height: '40px', color: lightGrey, fontWeight: 'bold', fontSize: '1em' }}
            onClick={ () => {
                props.onClick(toolButtonStyles[props.name] || 'none'); 
            } }
        >            
            { typeof props.text == 'string' ? props.text  : <props.icon /> }
        </ToggleButton>
    );
}

const EditorToolbar = (props) => {
    return (
        <Box sx={{
            background: darkGrey,
            color: lightGrey,
            fontSize: 'large',
            marginTop: '8px',
            height: '40px',
            lineHeight: '40px'
        }}>
            <ToggleButtonGroup value={['bold']} sx={{ borderRadius: 0 }}>
                <EditorToolbarButton
                    name={ 'bold' }
                    title="Make selection bold" 
                    icon={ FormatBold }
                    onClick={ props.buttonAction }
                >
                </EditorToolbarButton>
                <EditorToolbarButton 
                    name={ 'italic' }
                    title="Italicise selection" 
                    icon={ FormatItalic }
                    onClick={ props.buttonAction }
                >                    
                </EditorToolbarButton>
                <EditorToolbarButton 
                    name={ 'underline' }
                    title="Underline selection" 
                    icon={ FormatUnderlined }
                    onClick={ props.buttonAction }
                >                    
                </EditorToolbarButton>
                <EditorToolbarButton 
                    name={ 'h1' } 
                    title="Heading level 1" 
                    text={ 'H1' }
                    onClick={ props.buttonAction }
                >                    
                </EditorToolbarButton>
                <EditorToolbarButton 
                    name={ 'h2' } 
                    title="Heading level 2" 
                    text={ 'H2' }
                    onClick={ props.buttonAction }
                >                    
                </EditorToolbarButton>
                <EditorToolbarButton 
                    name={ 'h3' } 
                    title="Heading level 3" 
                    text={ 'H3' }
                    onClick={ props.buttonAction }
                >                    
                </EditorToolbarButton>
                <EditorToolbarButton 
                    name={ 'ul' } 
                    title="Create bulleted list" 
                    icon={ FormatListBulleted }
                    onClick={ props.buttonAction }
                >                    
                </EditorToolbarButton>
                <EditorToolbarButton 
                    name={ 'ol' } 
                    title="Create numbered list" 
                    icon={ FormatListNumbered }
                    onClick={ props.buttonAction }
                >                    
                </EditorToolbarButton>
            </ToggleButtonGroup>            
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
            toolbarFormats: [],
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

    onToolbarButtonAction(style) { 
        console.log('onToolbarButtonHandler()', style);
        let newEditorState = RichUtils.toggleInlineStyle(this.state.editorState, 'bold');
        this.setState({ editorState: newEditorState });
    }

    onStateChange(newState) {
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
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={9}>
                    <Panel.WhitePaper elevation={5}>  
                        <Box sx={{
                            background: darkGrey,
                            color: lightGrey,
                            fontSize: 'large',
                            marginTop: '8px',
                            height: '40px',
                            lineHeight: '40px'
                        }}>
                            <ToggleButtonGroup value={this.state.toolbarFormats} onChange={(evt, newFormats) => {
                                    console.log('Button group onChange()', newFormats);
                                    this.setState({toolbarFormats: newFormats});
                                }} sx={{ borderRadius: 0 }}>
                                {Toolbar.editorToolbarItems.map((eti) => (
                                    <ToggleButton 
                                        variant="text" 
                                        sx={{ width: '40px', height: '40px', color: lightGrey, fontWeight: 'bold', fontSize: '1em' }}
                                        key={eti.key} 
                                        value={eti.value} 
                                        title={eti.title} 
                                        onClick={this.onToolbarButtonAction.bind(this)}
                                    >
                                    { typeof eti.text == 'string' ? eti.text : eti.icon }
                                    </ToggleButton>
                                ))}                                
                            </ToggleButtonGroup>            
                        </Box>
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