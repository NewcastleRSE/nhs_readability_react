import { red, teal, grey } from "@mui/material/colors";
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

const toolButtonStyles = {
    'bold': 'BOLD',
    'italic': 'ITALIC',
    'underline': 'UNDERLINE'
};

const darkTheme = Object.assign(createTheme({ palette: { mode: 'dark' } }));

const darkGrey = grey.A700;
const lightGrey = grey.A100;

export { highlightingStyles, toolButtonStyles, darkTheme, darkGrey, lightGrey };