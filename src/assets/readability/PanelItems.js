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
        id: 'showPassiveSentences',
        primary: 'Show passive sentences',
        help: `
            <p>
            Highlight sentences which are in passive tense.
            </p>
            `,
        defaultChecked: false
    },
    {
        key: 3,
        id: 'highlightPrismWords',
        primary: 'Highlight PRISM-listed words',
        help: `
            <p>
            Highlights words that could be simpler. Hover the mouse over the word to see suggestions for simpler words or phrases.
            </p>
            `,
        defaultChecked: false
    },
    {
        key: 4,
        id: 'showLongWords',
        primary: 'Highlight long words',
        help: `
            <p>
            Highlights words that are 4 or more syllables in length.
            </p>
            `,
        defaultChecked: false
    }
   
];

const readabilitySwitchItems = [

    {
        key: 1,
        id: 'includeMedicalTerms',
        primary: 'Include medical terms in reading age scores',
        help: `
            <p>
            Medical words make the reading age higher. To check the reading age of writing excluding the medical terms, switch this button off.
            </p>
            `,
        defaultChecked: true
    }

]

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
        primary: 'Average words per sentence',
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
        primary: 'Average sentences per paragraph',
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
        help: `<p>Aim for a reading age of 11</p>`
    },
    {
        key: 2,
        id: 'readingTime',
        primary: 'Average reading time',
        help: 'Estimated reading time for document, based on a 250 words per minute average'
    },
   /* {
        key: 3,
        id: 'smogIndex',
        primary: 'SMOG Index',
        help: `
            <p>Returns the SMOG index of the text</a>
        `
    },
    {
        key: 4,
        id: 'fleschKincaid',
        primary: 'Flesch Kincaid Grade',
        help: ` <p>Returns the Flesh Kincaid grade of the given text - (US grades)</p>`
    } */
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
        sx = highlightingStyles['labelText'];
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

const ReadabilitySwitchItem = props => {
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

}

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
    readabilitySwitchItems,
    WhitePaper,
    PanelListSubheader,
    SwitchListItem,
    MetricListItem,
    ReadabilitySwitchItem,
    getSwitchByName
};