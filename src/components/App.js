import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';

import FirstTimeInstructionsBox from './FirstTimeInstructionsBox';
import NavigationBar from './NavigationBar';
import DocumentAnalyser from './DocumentAnalyser';

import { darkTheme } from '../assets/readability/Styles';
import '../assets/css/App.css';

export default class App extends React.Component {
    render() {
        return (
            <ThemeProvider theme={darkTheme}>
                <FirstTimeInstructionsBox />
                <main>
                    <NavigationBar />
                    <DocumentAnalyser />
                </main>
            </ThemeProvider>
        );
    }
}
