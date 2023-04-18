import { FormatUnderlined } from "@mui/icons-material";
import { red, teal, grey, green, amber } from "@mui/material/colors";
import { createTheme } from '@mui/material/styles';

const highlightingStyles = {
    'showPassiveSentences': {
        color: '#ffffff',
        padding: '0.05em',
        lineHeight: '1.8rem',
        backgroundColor: '#879a9a' 
    },
    'highlightPrismWords': {
        color: '#ffffff',
        padding: '0.05em',
        lineHeight: '1.8rem',
        backgroundColor: '#55ad56'
    },
    'showLongWords': {
        color: '#ffffff',
        padding: '0.05em',
        lineHeight: '1.8rem',
        backgroundColor: '#9971bf'
    },
    'showComplexSentences': {
        color: '#ffffff',
        padding: '0.05em',
        lineHeight: '1.8rem',
        backgroundColor: '#db6ba5'
    },
    'normalText': {
        fontWeight: 'normal',
        color: grey[900],
        padding: '0.2em',
        margin: '0.2em 0',
        backgroundColor: grey[100]
    },
    'labelText': {
        fontWeight: 'normal',
        color: grey[900],
        padding: '0.2em',
        margin: '0.2em 0',
        backgroundColor: grey[100]
    }
};

const readingAgeTrafficLightStyles = {
    'green': {
        fontWeight: 'bold', 
        color: '#ffffff',
        padding: '0.2em',
        margin: '0.2em 0',
        backgroundColor: '#63ba54'
    },
    'amber': {
        fontWeight: 'bold', 
        color: '#ffffff',
        padding: '0.2em',
        margin: '0.2em 0',
        backgroundColor: '#FBBE17'
    },
    'red': {
        fontWeight: 'bold', 
        color: '#ffffff',
        padding: '0.2em',
        margin: '0.2em 0',
        backgroundColor: '#e67930'
    }
};

const darkTheme = Object.assign(createTheme({ palette: { mode: 'dark' } }));

export { highlightingStyles, readingAgeTrafficLightStyles, darkTheme };