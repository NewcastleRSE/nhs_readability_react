import React, { Component } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { grey } from "@mui/material/colors";

export default class FirstTimeInstructionsBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showInstructions: localStorage.getItem('hideInstructions') == null
        }
    }

    onClose() {
        this.setState({ showInstructions: !this.state.showInstructions });
    }

    render() {
        const style = {
            // position: 'absolute',
            // top: '50%',
            // left: '50%',
            // transform: 'translate(-50%, -50%)',
            // width: '50%',
            // height: '50%',
            // bgcolor: 'white',
            // border: '1px solid white',
            // boxShadow: 24,
            // p: 4,
            '& .MuiDialog-container': {
                '& .MuiPaper-root': {
                    position: 'absolute',
                    color: grey[800],
                    top: '25%',
                    left: '25%',
                    width: '75%',
                    height: '50%',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: 4
                }
            }
        };
        return (
            <Dialog
                aria-labelledby="first-time-instructions-title"
                aria-describedby="first-time-instructions-description"
                open={this.state.showInstructions}
                onClose={this.onClose.bind(this)}
                closeAfterTransition
                fullWidth
                sx={style}
            >
                <DialogTitle sx={{
                    m: 0, p: 2
                }}>
                    NHS Document Readability Tool
                    <IconButton
                        aria-label="close"
                        onClick={this.onClose.bind(this)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    Tips for first-time users
                </DialogContent>
            </Dialog>
        )
    }
}
