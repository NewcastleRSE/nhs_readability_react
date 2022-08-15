const switchListItems = [
    {
        key: 1,
        id: 'showComplexSentences',
        primary: 'Show complex sentences',
        help: 'Highlight sentences which are too complex and show potential alternatives',
        defaultChecked: true
    },
    {
        key: 2,
        id: 'highlightPrismWords',
        primary: 'Highlight PRISM-listed words',
        help: 'Highlight words in the PRISM readability Toolkit having a simpler alternative word or phrase',
        defaultChecked: true
    },
    {
        key: 3,
        id: 'includeMedicalTerms',
        primary: 'Include medical terms in grading',
        help: 'Compute the SMOG Index and Reading Age including all the medical terms',
        defaultChecked: true
    }
];

const metricListItems = [
    {
        key: 1,
        id: 'nCharacters',
        primary: 'Characters',
        help: 'Total number of characters in document'
    },
    {
        key: 2,
        id: 'nSpaces',
        primary: 'Whitespace',
        help: 'Total number of whitespace characters (space, newline, tab) in document'
    },
    {
        key: 3,
        id: 'nWords',
        primary: 'Words',
        help: 'Total number of words in document'
    },
    {
        key: 4,
        id: 'nSentences',
        primary: 'Sentences',
        help: 'Total number of sentences in document'
    },
    {
        key: 5,
        id: 'nParagraphs',
        primary: 'Paragraphs',
        help: 'Total number of paragraphs in document'
    }
];

const readabilityListItems = [
    {
        key: 1,
        id: 'readingTime',
        primary: 'Average reading time',
        help: 'Estimated reading time for document, based on a 250 words per minute average'
    },
    {
        key: 2,
        id: 'smogIndex',
        primary: 'SMOG Index',
        help: `
            <p>Returns the SMOG index of the given text. This is a grade formula in that a score of 9.3 means that a US ninth grader would be able to read the document.
            Texts of fewer than 30 sentences are statistically invalid, because the SMOG formula was normed on 30-sentence samples</p>
            Further reading on <a href="https://en.wikipedia.org/wiki/SMOG" target="_blank">Wikipedia</a>
        `
    },
    {
        key: 3,
        id: 'ukReadingAge',
        primary: 'Estimated UK Reading Age',
        help: `
            <p>The US grade system is translated into a UK school reading age via the following table:</p>
            <table class="table is-fullwidth">
                <tr><th>Year in<br/>England</th><th>Student age</th><th>US grade</th></tr>
                <tr><td>Nursery</td><td>3-4</td><td>Preschool</td></tr>
                <tr><td>Reception</td><td>4-5</td><td>Preschool</td></tr>
                <tr><td>Year 2</td><td>6-7</td><td>Grade 1</td></tr>
                <tr><td>Year 3</td><td>7-8</td><td>Grade 2</td></tr>
                <tr><td>Year 4</td><td>8-9</td><td>Grade 3</td></tr>
                <tr><td>Year 5</td><td>9-10</td><td>Grade 4</td></tr>
                <tr><td>Year 6</td><td>10-11</td><td>Grade 5</td></tr>
                <tr><td>Year 7</td><td>11-12</td><td>Grade 6</td></tr>
                <tr><td>Year 8</td><td>12-13</td><td>Grade 7</td></tr>
                <tr><td>Year 9</td><td>13-14</td><td>Grade 8</td></tr>
                <tr><td>Year 10</td><td>14-15</td><td>Grade 9</td></tr>
                <tr><td>Year 11</td><td>15-16</td><td>Grade 10</td></tr>
                <tr><td>Year 12</td><td>16-17</td><td>Grade 11</td></tr>
                <tr><td>Year 13</td><td>17-18</td><td>Grade 12</td></tr>
            </table>                    
        `
    }
];

export { switchListItems, metricListItems, readabilityListItems };