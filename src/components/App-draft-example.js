import { Editor, EditorState, RichUtils } from 'draft-js';
import * as React from 'react';

export default class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty()
        };
    }

    handleChange = (editorState) => {
        this.setState({ editorState });
    }

    onStrike = () => {
        const editorState = this.state.editorState;
        const selectionState = editorState.getSelection();
        const newSelection = selectionState.merge({
            anchorOffset: 1,
            focusOffset: 10
        })
        const editorStateWithNewSelection = EditorState.forceSelection(editorState, newSelection);
        const editorStateWithStyles = RichUtils.toggleInlineStyle(editorStateWithNewSelection, 'STRIKEOUT')
        const editorStateWithStylesAndPreviousSelection = EditorState.forceSelection(
            editorStateWithStyles,
            selectionState
        )
        this.handleChange(editorStateWithStylesAndPreviousSelection);
    }

    render() {
        return (
            <div className="container-root">
                <Editor
                    placeholder="Type away :)"
                    editorState={this.state.editorState}
                    onChange={this.handleChange}
                    customStyleMap={{
                        STRIKEOUT: { textDecoration: 'line-through' }
                    }}
                />
                <button onClick={this.onStrike}>Strike!</button>
            </div>
        );
    }

}
