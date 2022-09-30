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

const darkTheme = Object.assign(createTheme({ palette: { mode: 'dark' } }));

const darkGrey = grey.A700;
const lightGrey = grey.A200;

const toolbar = {
    background: darkGrey,
    marginTop: '8px'
}

const toolButtonInactive = {
    width: '40px', 
    height: '40px', 
    background: darkGrey,
    color: lightGrey, 
    fontWeight: 'bold', 
    fontSize: '1em',
    borderRadius: 0
};

const toolButtonActive = {
    width: '40px', 
    height: '40px',
    background: grey[500],
    color: grey[50],
    fontWeight: 'bold', 
    fontSize: '1em',
    borderRadius: 0
};

export { highlightingStyles, darkTheme, darkGrey, lightGrey, toolbar, toolButtonInactive, toolButtonActive };