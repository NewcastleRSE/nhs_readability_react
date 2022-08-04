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

const readabilityListItems = [
    {
        key: 1,
        id: 'readingTime',
        primary: 'Average reading time',
        help: 'Estimated reading time for document, based on a 250 words per minute average'
    },
    {
        key: 2,
        id: 'smogIndex',
        primary: 'SMOG Index',
        help: `
            <p>Returns the SMOG index of the given text. This is a grade formula in that a score of 9.3 means that a US ninth grader would be able to read the document.
            Texts of fewer than 30 sentences are statistically invalid, because the SMOG formula was normed on 30-sentence samples</p>
            Further reading on <a href="https://en.wikipedia.org/wiki/SMOG" target="_blank">Wikipedia</a>
        `
    },
    {
        key: 3,
        id: 'ukReadingAge',
        primary: 'Estimated UK Reading Age',
        help: `
            <p>The US grade system is translated into a UK school reading age via the following table:</p>
            <table class="table is-fullwidth">
                <tr><th>Year in<br/>England</th><th>Student age</th><th>US grade</th></tr>
                <tr><td>Nursery</td><td>3-4</td><td>Preschool</td></tr>
                <tr><td>Reception</td><td>4-5</td><td>Preschool</td></tr>
                <tr><td>Year 2</td><td>6-7</td><td>Grade 1</td></tr>
                <tr><td>Year 3</td><td>7-8</td><td>Grade 2</td></tr>
                <tr><td>Year 4</td><td>8-9</td><td>Grade 3</td></tr>
                <tr><td>Year 5</td><td>9-10</td><td>Grade 4</td></tr>
                <tr><td>Year 6</td><td>10-11</td><td>Grade 5</td></tr>
                <tr><td>Year 7</td><td>11-12</td><td>Grade 6</td></tr>
                <tr><td>Year 8</td><td>12-13</td><td>Grade 7</td></tr>
                <tr><td>Year 9</td><td>13-14</td><td>Grade 8</td></tr>
                <tr><td>Year 10</td><td>14-15</td><td>Grade 9</td></tr>
                <tr><td>Year 11</td><td>15-16</td><td>Grade 10</td></tr>
                <tr><td>Year 12</td><td>16-17</td><td>Grade 11</td></tr>
                <tr><td>Year 13</td><td>17-18</td><td>Grade 12</td></tr>
            </table>                    
        `
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
            },
            readability: {
                readingTime: 0,
                smogIndex: 0,
                ukReadingAge: 0
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
                                /* Set basic document metrics */
                                const newMetrics = textModel.getMetrics();
                                console.log(newMetrics);
                                this.setState({ 'metrics': newMetrics });
                                /* Set readability metrics */
                                const smog = textModel.smogIndex();
                                this.setState({'readability': {
                                    readingTime: textModel.averageReadingTime(),
                                    smogIndex: smog,
                                    ukReadingAge: textModel.toUKReadingAge(smog)
                                }});
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
                    <WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={<PanelListSubheader caption="Readability Metrics" />}>
                            {readabilityListItems.map((rli) => (
                                <MetricListItem key={rli.key} id={rli.id} primary={rli.primary} value={this.state.readability[rli.id]} />
                            ))}
                        </List>
                    </WhitePaper>
                </Grid>
            </Grid>
        );
    }
}