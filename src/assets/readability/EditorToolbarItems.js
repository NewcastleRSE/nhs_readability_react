import { FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted, FormatListNumbered } from "@mui/icons-material";

const editorToolbarItems = [
    {
        key: 1,
        value: 'bold',
        title: 'Make selection bold',
        icon: <FormatBold />
    },
    {
        key: 2,
        value: 'italic',
        title: 'Italicise selection',
        icon: <FormatItalic />
    },
    {
        key: 3,
        value: 'underline',
        title: 'Underline selection',
        icon: <FormatUnderlined />
    },
    {
        key: 4,
        value: 'h1',
        title: 'Heading level 1',
        text: 'H1'
    },
    {
        key: 5,
        value: 'h2',
        title: 'Heading level 2',
        text: 'H2'
    },
    {
        key: 6,
        value: 'h3',
        title: 'Heading level 3',
        text: 'H3'
    },
    {
        key: 7,
        value: 'ul',
        title: 'Create bulleted list',
        icon: <FormatListBulleted />
    },
    {
        key: 8,
        value: 'ol',
        title: 'Create numbered list',
        icon: <FormatListNumbered />
    }
];

export { editorToolbarItems };