import { FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted, FormatListNumbered } from "@mui/icons-material";

const editorToolbarItems = [
    {
        key: 1,
        value: 'bold',
        title: 'Make selection bold',
        style: 'BOLD',
        type: 'inline',
        icon: <FormatBold />
    },
    {
        key: 2,
        value: 'italic',
        title: 'Italicise selection',
        style: 'ITALIC',
        type: 'inline',
        icon: <FormatItalic />
    },
    {
        key: 3,
        value: 'underline',
        title: 'Underline selection',
        style: 'UNDERLINE',
        type: 'inline',
        icon: <FormatUnderlined />
    },
    {
        key: 4,
        value: 'h1',
        title: 'Heading level 1',
        style: 'header-one',
        type: 'block',
        text: 'H1'
    },
    {
        key: 5,
        value: 'h2',
        title: 'Heading level 2',
        style: 'header-two',
        type: 'block',
        text: 'H2'
    },
    {
        key: 6,
        value: 'h3',
        title: 'Heading level 3',
        style: 'header-three',
        type: 'block',
        text: 'H3'
    },
    {
        key: 7,
        value: 'ul',
        title: 'Create bulleted list',
        style: 'unordered-list-item',
        type: 'block',
        icon: <FormatListBulleted />
    },
    {
        key: 8,
        value: 'ol',
        title: 'Create numbered list',
        style: 'ordered-list-item',
        type: 'block',
        icon: <FormatListNumbered />
    }
];

export { editorToolbarItems };