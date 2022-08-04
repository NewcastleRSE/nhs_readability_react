import MUIRichTextEditor from 'mui-rte';
import * as React from 'react';
import { Grid, Paper, List, ListSubheader, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import { Help } from '@mui/icons-material';
import TextModel from '../assets/readability/TextModel';
import { switchListItems, metricListItems, readabilityListItems } from '../assets/readability/PanelItems';
import tippy from 'tippy.js';
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import 'tippy.js/themes/material.css';

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
            <Help data-tippy-content={help} data-tippy-placement="top" />
        </HelpListitem>
    );
}

const SwitchListItem = props => {
    const { id, primary, help, defaultChecked } = props;
    const sx = { color: darkGrey, background: lightGrey };
    return (
        <ListItem>
            <HelpIcon help={help} />
            <ListItemText id={id} primary={primary} sx={sx} />
            <AntSwitch
                color='default'
                defaultChecked={defaultChecked}
            />
        </ListItem>
    );
};

const MetricListItem = props => {
    const { id, primary, help, value } = props;
    const sx = { color: darkGrey, background: lightGrey };
    return (
        <ListItem>
            <HelpIcon help={help} />
            <ListItemText id={id} primary={primary} sx={sx} />
            <ListItemText primary={value} sx={ Object.assign({}, sx, { textAlign: 'right', paddingRight: '1em' }) } />
        </ListItem>
    );
};

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
    componentDidMount() {
        tippy.setDefaultProps({
            theme: 'material',
            arrow: true,
            delay: [200, 200],
            allowHTML: true,
            interactive: true,
            maxWidth: '20rem'
        });
        tippy('[data-tippy-content]');
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
                            {switchListItems.map((sli) => (
                                <SwitchListItem key={sli.key} id={sli.id} primary={sli.primary} help={sli.help} defaultChecked={sli.defaultChecked} />
                            ))}
                        </List>
                    </WhitePaper>
                    <WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={<PanelListSubheader caption="Current Document Metrics" />}>
                            {metricListItems.map((mli) => (
                                <MetricListItem key={mli.key} id={mli.id} primary={mli.primary} help={mli.help} value={this.state.metrics[mli.id]} />
                            ))}
                        </List>
                    </WhitePaper>
                    <WhitePaper elevation={5}>
                        <List sx={{ width: '100%' }} subheader={<PanelListSubheader caption="Readability Metrics" />}>
                            {readabilityListItems.map((rli) => (
                                <MetricListItem key={rli.key} id={rli.id} primary={rli.primary} help={rli.help} value={this.state.readability[rli.id]} />
                            ))}
                        </List>
                    </WhitePaper>
                </Grid>
            </Grid>
        );
    }
}