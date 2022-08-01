import MUIRichTextEditor from 'mui-rte';
import * as React from 'react';
import { Grid, Paper, List, ListSubheader, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Switch from '@mui/material/Switch';
import { Help } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { EditorState } from 'draft-js';
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
            }} { ...other }>{ caption }
        </ListSubheader>
    );
};

const PanelListItem = props => {
    const { id, primary } = props;
    const sx = { color: darkGrey, background: lightGrey };
    return ( 
        <ListItem>
            <ListItemIcon sx={ sx }><Help /></ListItemIcon>                             
            <ListItemText id={ id } primary={ primary } sx={ sx } />
            <Switch
                defaultChecked
                color='default'
                sx={{ sx }}
            />
        </ListItem>
    );
};

const panelListItems = [
    {
        key: 1,
        id: 'show-complex-sentences',
        primary: 'show-complex-sentences',
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

const textModel = new TextModel();

export default class DocumentAnalyser extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
    }
    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={9}>
                    <WhitePaper elevation={5}>
                        <MUIRichTextEditor 
                            label='&nbsp;Type or paste document here'
                            inlineToolbar={true}
                            onChange={ newState => textModel.update(newState) }
                        />
                    </WhitePaper>                        
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    <WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={ <PanelListSubheader caption="Document Analysis Options" />}>
                            { panelListItems.map((pli) => (
                                <PanelListItem key={pli.key} id={pli.id} primary={pli.primary} />
                            )) }
                        </List>
                    </WhitePaper>                        
                </Grid>                
            </Grid>            
        );            
    }
}