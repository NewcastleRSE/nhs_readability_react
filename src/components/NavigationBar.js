import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const pages = ['Docs', 'Contact', 'Login'];

export default class NavigationBar extends React.Component {
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
                            sx={{ mr: 2 }}
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
                                textDecoration: "none"
                            }}>
                            NHS Medical Document Readability Tool
                        </Link>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            { pages.map((page) => (
                                <Button
                                    key={page}                                    
                                    sx={{ 
                                        my: 2, 
                                        color: 'inherit', 
                                        display: 'block' 
                                    }}
                                >{page}
                                </Button>
                            )) }
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        );
    }
}