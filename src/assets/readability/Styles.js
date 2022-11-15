import { red, teal, grey, green, amber } from "@mui/material/colors";
import { createTheme } from '@mui/material/styles';

const highlightingStyles = {
    'showComplexSentences': {
        color: '#ffffff',
        padding: '0.05em',
        lineHeight: '1.8rem',
        backgroundColor: '#DD95BA'
    },
    'highlightPrismWords': {
        color: '#ffffff',
        padding: '0.05em',
        lineHeight: '1.8rem',
        backgroundColor: '#72B16F'
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
        backgroundColor: green[800]
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
        backgroundColor: red[800]
    }
};

const darkTheme = Object.assign(createTheme({ palette: { mode: 'dark' } }));

export { highlightingStyles, readingAgeTrafficLightStyles, darkTheme };