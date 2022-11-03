import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import { Help } from '@mui/icons-material';
import { Paper, ListSubheader, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { highlightingStyles, readingAgeTrafficLightStyles } from './Styles';

const switchListItems = [
    {
        key: 1,
        id: 'showComplexSentences',
        primary: 'Show complex sentences',
        help: `
            Highlight sentences which are too complex, defined by:
            <p>
            SMOG = 3 + &radic;(no_of_3+_syllable_words) > threshold.  
            </p>
            <p>
            NOTE: The threshold for complexity is set artificially low for demonstration purposes (most documents will show up some complexity).
            </p>
            <p>
            QUESTIONS FOR TESTERS: How do we want to measure complexity? How might suggestions to rectify it be communicated?
            </p>
            `,
        defaultChecked: true
    },
    {
        key: 2,
        id: 'highlightPrismWords',
        primary: 'Highlight PRISM-listed words',
        help: `
            <p>
            Highlight words in the <a href="https://www.nhlbi.nih.gov/files/docs/ghchs_readability_toolkit.pdf" target="_blank">PRISM readability Toolkit</a>
            having a simpler alternative word or phrase.  Hovering the cursor over a highlighted 
            word will make some suggestions of simpler alternatives.  It might be possible to click on a suggestion eventually and do an 
            auto-replace of the complex word by the simpler.  
            </p>
            <p>
            NOTE: You need to turn off the complex sentences to see the PRISM highlights - it does not seem to be possible to have the two together.
            </p>
            `,
        defaultChecked: false
    },
    {
        key: 3,
        id: 'includeMedicalTerms',
        primary: 'Include medical terms in reading age scores',
        help: `
            Compute the SMOG Index and Reading Age including all the medical terms.  To properly filter out medical terms requires a set of medical vocabularies, 
            possibly classified by discipline area.  A comprehensive medical dictionary may work but would likely be very sluggish in operation.
            For the demonstration, if this switch if OFF, the PRISM words are filtered out and the SMOG index and Reading Age computed with the 
            reduced word set.
            `,
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
        id: 'avWordsPerSentence',
        primary: 'Average words / sentence',
        help: 'Average number of words per sentence'
    },
    {
        key: 5,
        id: 'nSentences',
        primary: 'Sentences',
        help: 'Total number of sentences in document'
    },
    {
        key: 6,
        id: 'avSentencesPerParagraph',
        primary: 'Average sentences / paragraph',
        help: 'Average number of sentences per paragraph'
    },
    {
        key: 7,
        id: 'nParagraphs',
        primary: 'Paragraphs',
        help: 'Total number of paragraphs in document'
    }
];

const readabilityListItems = [
    {
        key: 1,
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
    },
    {
        key: 2,
        id: 'readingTime',
        primary: 'Average reading time',
        help: 'Estimated reading time for document, based on a 250 words per minute average'
    },
    {
        key: 3,
        id: 'smogIndex',
        primary: 'SMOG Index',
        help: `
            <p>Returns the SMOG index of the given text. This is a grade formula in that a score of 9.3 means that a US ninth grader would be able to read the document.
            Texts of fewer than 30 sentences are statistically invalid, because the SMOG formula was normed on 30-sentence samples</p>
            Further reading on <a href="https://en.wikipedia.org/wiki/SMOG" target="_blank">Wikipedia</a>
        `
    }
];

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

const HelpIcon = props => {
    const { help, ...other } = props;
    return (
        <HelpListitem>
            <Help data-tippy-content={help} data-tippy-placement="left" />
        </HelpListitem>
    );
}

const SwitchListItem = props => {
    const { id, primary, help, defaultChecked, onChange } = props;
    let sx;
    if (highlightingStyles[id]) {
        /* Shoehorn in a bit of right pad to avoid the coloured label touching the switch element which looks really bad */
        sx = Object.assign({}, highlightingStyles[id], { marginRight: '2em' });
    } else {
        sx = highlightingStyles['normalText'];
    }    
    return (
        <ListItem>
            <HelpIcon help={help} />
            <ListItemText primary={primary} sx={sx} />
            <AntSwitch
                id={id}
                color='default'
                defaultChecked={defaultChecked}
                onChange={onChange}
            />
        </ListItem>
    );
};

const MetricListItem = props => {
    const { id, primary, help, value } = props;
    const textStyle = { color: darkGrey, background: lightGrey };
    let valueStyle = textStyle;
    if (id == 'ukReadingAge') {
        /* Apply traffic light style to reading age output */
        if (value && !isNaN(value)) {
            if (value <= 13) {
                valueStyle = readingAgeTrafficLightStyles['green'];
            } else if (value <= 16) {
                valueStyle = readingAgeTrafficLightStyles['amber'];
            } else {
                valueStyle = readingAgeTrafficLightStyles['red'];
            }
        }
    }
    valueStyle = Object.assign({}, valueStyle, { textAlign: 'right', paddingRight: '1em' });
    return (
        <ListItem>
            <HelpIcon help={help} />
            <ListItemText id={id} primary={primary} sx={textStyle} />
            <ListItemText primary={value} sx={valueStyle} />
        </ListItem>
    );
};

const getSwitchByName = (id) => {
    return(switchListItems.find(item => item.id == id) || {});
};

export { 
    switchListItems, 
    metricListItems, 
    readabilityListItems,
    WhitePaper,
    PanelListSubheader,
    SwitchListItem,
    MetricListItem,
    getSwitchByName
};