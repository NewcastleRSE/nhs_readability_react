import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { AppsOutage, SpatialTrackingTwoTone } from '@mui/icons-material';

const pages = [
   /* {
        key: 'Docs',
        url: '',
        title: 'View the documentation in a new tab (Not Implemented!)'
    }, */
    {
        key: 'More information',
        url: '',
        title: 'Click to see more information about the tool'
    }/*,
    {
        key: 'Contact',
        url: 'https://github.com/NewcastleRSE/nhs_readability_react/issues',
        title: 'Report an issue with the tool directly into the GitHub issues database'
    },
    {
        key: 'Login',
        url: '',
        title: 'Log in as a registered user (Not Implemented!)'
    } */
];

const drawerWidth = 250;

export default class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            open: false
        };
    }

   
    handleDrawerToggle() {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

  
    handleClickOpen() {
      this.setState({ open: true });
    };
  
    handleClose() {
        this.setState({ open: false });
    };


    render() {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={this.handleDrawerToggle.bind(this)}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Link
                            variant="h5"
                            href="#"
                            color="inherit"
                            nowrap="true"
                            sx={{
                                flexGrow: 1,
                                textTransform: "uppercase",
                                textDecoration: "none",
                                display: {
                                    xs: 'none',
                                    sm: 'block'
                                }
                            }}>
                            NHS Medical Document Readability Tool
                        </Link>
                        <Box sx={{ display: { xs: 'none', md: 'flex', sm: 'flex' } }}>
                            { pages.map((page) => (
                                <Button
                                    key={page.key}                                    
                                    sx={{ 
                                        my: 2, 
                                        color: 'inherit', 
                                        display: 'block' 
                                    }}
                                    onClick={() => {
                                        if (page.url) {
                                            window.open(page.url, '_blank');
                                        } 
                                        else if (page.key==='More information') {
                                            this.handleClickOpen();
                                        }                                  
                                    }}
                                    title={page.title}
                                >{page.key}
                                </Button>
                            )) }
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box component="nav">
                    <Drawer                    
                        variant="temporary"
                        open={this.state.mobileOpen}
                        onClose={this.handleDrawerToggle.bind(this)}
                        ModalProps={{
                            keepMounted: true, /* Better open performance on mobile */
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        <Box onClick={this.handleDrawerToggle.bind(this)} sx={{ textAlign: 'center' }}>
                            <Link
                                variant="h6"
                                href="#"
                                color="inherit"
                                nowrap="true"
                                sx={{
                                    textTransform: "uppercase",
                                    textDecoration: "none",
                                    
                                }}>
                                NHS Readability Tool
                            </Link>
                            <Divider />
                            <List>
                                {pages.map((page) => (
                                <ListItem key={page.key} disablePadding>
                                    <ListItemButton sx={{ textAlign: 'left', display: 'none' }}>
                                        <ListItemText primary={page.key} title={page.title} />
                                    </ListItemButton>
                                </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </Box>

                <div>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose.bind(this)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        sx={{
                         '& .MuiDialog-paper': { backgroundColor: 'white', color: '#000' },
                        }}
                    >
                    <DialogTitle id="alert-dialog-title">
                         NHS Readability Tool Information
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description"  sx={{
                                m: 0, 
                                p: 2,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif;`,
                                fontSize: 18,
                                color: '#000'
                            }}> 
                                <span>The UK reading age is calculated on the Flesch Kincaid system of measurement. This is a US based algorithm that can be converted into a UK average reading age. Flesch Kincaid is also the algorithm used by Microsoft Word, so calculated reading ages should be consistent.</span> <br></br><br></br>
                                <span>The tool works by analysing submitted text and splitting it into paragraphs and single words. Words are also analysed for syllable content. Words with 4 or more syllables are classed as long words. Replacing longer words with simpler alternatives will help reduce the overall reading age of the text. The average reading age in the UK is 11, so text readability should be a close to 11 as possible, although 13 or below is also a good result. </span>
                                
                               
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose.bind(this)}>Close</Button>
                    </DialogActions>
                    </Dialog>
                </div>
            </Box>
        );
    }
}