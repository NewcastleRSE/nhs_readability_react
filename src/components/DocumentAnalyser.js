import MUIRichTextEditor from 'mui-rte';
import * as React from 'react';
import { Grid, Paper, List, ListSubheader, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import { Help } from '@mui/icons-material';
import TextModel from '../assets/readability/TextModel';

const darkGrey = grey.A700;
const lightGrey = grey.A100;

const WhitePaper = props => {
    const { elevation, ...other } = props;
    return <Paper elevation={elevation} sx={{ background: lightGrey }} {...other} />
};

const PanelListSubheader = props => {
    const { caption, ...other } = props;
    return (
        <ListSubheader sx={{
            background: darkGrey,
            color: lightGrey,
            fontSize: 'large',
            marginTop: '8px',
            height: '40px',
            lineHeight: '40px'
        }} {...other}>{caption}
        </ListSubheader>
    );
};

/* Thanks to: https://mui.com/material-ui/react-switch/ */
const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.primary.dark,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.grey[500],
        boxSizing: 'border-box',
    },
}));

const HelpListitem = styled(ListItemIcon)(({theme}) => ({
    color: theme.palette.info.dark
}));

const HelpIcon = () => {
    return (
        <HelpListitem><Help /></HelpListitem>
    );
}

const PanelListItem = props => {
    const { id, primary } = props;
    const sx = { color: darkGrey, background: lightGrey };
    return (
        <ListItem>
            <HelpIcon />
            <ListItemText id={id} primary={primary} sx={sx} />
            <AntSwitch
                color='default'
                defaultChecked
            />
        </ListItem>
    );
};

const MetricListItem = props => {
    const { id, primary, value } = props;
    const sx = { color: darkGrey, background: lightGrey };
    return (
        <ListItem>
            <HelpIcon />
            <ListItemText id={id} primary={primary} sx={sx} />
            <ListItemText primary={value} sx={ Object.assign({}, sx, { textAlign: 'right', paddingRight: '1em' }) } />
        </ListItem>
    );
};

const panelListItems = [
    {
        key: 1,
        id: 'show-complex-sentences',
        primary: 'Show complex sentences',
        defaultChecked: true
    },
    {
        key: 2,
        id: 'show-medical-terms',
        primary: 'Highlight medical terms',
        defaultChecked: true
    },
    {
        key: 3,
        id: 'include-medical-terms',
        primary: 'Include medical terms in grading',
        defaultChecked: true
    }
];

const metricListItems = [
    {
        key: 1,
        id: 'nCharacters',
        primary: 'Characters',
        help: 'Total number of characters in document'
    },
    {
        key: 2,
        id: 'nSpaces',
        primary: 'Whitespace',
        help: 'Total number of whitespace characters (space, newline, tab) in document'
    },
    {
        key: 3,
        id: 'nWords',
        primary: 'Words',
        help: 'Total number of words in document'
    },
    {
        key: 4,
        id: 'nSentences',
        primary: 'Sentences',
        help: 'Total number of sentences in document'
    },
    {
        key: 5,
        id: 'nParagraphs',
        primary: 'Paragraphs',
        help: 'Total number of paragraphs in document'
    }
];

const textModel = new TextModel();

export default class DocumentAnalyser extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            metrics: {
                nCharacters: 0,
                nSpaces: 0,
                nPunctuation: 0,
                nWords: 0,
                nSyllables: 0,
                nPolySyllables: 0,
                nSentences: 0,
                nParagraphs: 0
            }
        };
    }
    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={9}>
                    <WhitePaper elevation={5}>
                        <MUIRichTextEditor
                            label='&nbsp;Type or paste document here'
                            inlineToolbar={true}
                            onChange={ (newState) => {
                                textModel.stateUpdate(newState);
                                const newMetrics = textModel.getMetrics();
                                console.log(newMetrics);
                                this.setState({ 'metrics': newMetrics });
                            } }
                        />
                    </WhitePaper>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    <WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={<PanelListSubheader caption="Document Analysis Options" />}>
                            {panelListItems.map((pli) => (
                                <PanelListItem key={pli.key} id={pli.id} primary={pli.primary} />
                            ))}
                        </List>
                    </WhitePaper>
                    <WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={<PanelListSubheader caption="Current Document Metrics" />}>
                            {metricListItems.map((mli) => (
                                <MetricListItem key={mli.key} id={mli.id} primary={mli.primary} value={this.state.metrics[mli.id]} />
                            ))}
                        </List>
                    </WhitePaper>
                </Grid>
            </Grid>
        );
    }
}