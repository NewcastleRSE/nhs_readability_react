import { red, teal, grey, green, amber } from "@mui/material/colors";
import { createTheme } from '@mui/material/styles';

const highlightingStyles = {
    'showComplexSentences': {
        fontWeight: 'bold', 
        color: '#ffffff',
        padding: '0.2em',
        margin: '0.2em 0',
        backgroundColor: red[800]
    },
    'highlightPrismWords': {
        fontWeight: 'bold',
        color: '#ffffff',
        padding: '0.2em',
        margin: '0.2em 0',
        backgroundColor: teal[800]
    },
    'normalText': {
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
        backgroundColor: amber[800]
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