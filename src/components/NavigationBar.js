import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';

const pages = [
    {
        key: 'Docs',
        url: '',
        title: 'View the documentation in a new tab (Not Implemented!)'
    },
    {
        key: 'Contact',
        url: 'https://github.com/NewcastleRSE/nhs_readability_react/issues',
        title: 'Report an issue with the tool directly into the GitHub issues database'
    },
    {
        key: 'Login',
        url: '',
        title: 'Log in as a registered user (Not Implemented!)'
    }
];

const drawerWidth = 250;

export default class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false
        };
    }

    handleDrawerToggle() {
        this.setState({ mobileOpen: !this.state.mobileOpen });
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
                                        } else {
                                            alert('Not implemented yet!');
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
                                    <ListItemButton sx={{ textAlign: 'left' }}>
                                        <ListItemText primary={page.key} title={page.title} />
                                    </ListItemButton>
                                </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </Box>
            </Box>
        );
    }
}