import { createTheme } from '@mui/material/styles';
import { grey } from "@mui/material/colors";

const darkTheme = Object.assign(createTheme({ palette: { mode: 'dark' }}, {
    overrides: {        
        MUIRichTextEditor: {
            root: {
                height: 'calc(100vh - 100px)',                
            },
            toolbar: {
                background: grey.A700,
                height: '40px',
                paddingLeft: '5px',
                verticalAlign: 'middle'
            },
            editor: {
                padding: '5px 10px',                
                overflowY: 'auto',
                color: grey[900]
            },
            placeHolder: {
                paddingLeft: '5px',
                width: 'inherit',
                position: 'static',
                color: grey.A700
             }    
        }
    }
}));

export default darkTheme;