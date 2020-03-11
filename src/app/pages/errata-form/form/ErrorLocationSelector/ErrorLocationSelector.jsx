import React, {useState} from 'react';
import managedInvalidMessage from '../InvalidMessage.jsx';
import bookToc from '~/models/book-toc';
import $ from '~/helpers/$';
import css from './ErrorLocationSelector.css';

function treeEntry(title, indentLevel, parent, isChapter) {
    const value = parent ? `${parent}:${title}` : title;

    return {
        title,
        indentLevel,
        parent,
        value,
        isChapter
    }
}

function flattenTree(contents, indentLevel=0, parent='') {

    return contents.map((entry) => {
        const title = $.htmlToText(entry.title);
        const isChapter = Boolean(entry.contents);
        const thisEntry = treeEntry(title, indentLevel, parent, isChapter);

        return [thisEntry]
            .concat(entry.contents ? flattenTree(entry.contents, indentLevel+1, thisEntry.value) : [])
    }).flat();
}

function ChapterOption({entry, chapterFilter, updateChapterFilter}) {
    const onClick = (event) => {
        const value = chapterFilter === event.target.value ? entry.parent : event.target.value;

        updateChapterFilter(value);
    }

    return (
        <option className={`indent-${entry.indentLevel} chapter`}
         value={entry.value}
         onClick={onClick}
        >
            {entry.title}
        </option>
    );
}

function PageOption({entry}) {
    return (
        <option className={`indent-${entry.indentLevel}`}
         value={entry.value}
        >
            {entry.title}
        </option>
    );
}

function TocSelector({selectedBook}) {
    const inputRef = React.createRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);
    const [chapterFilter, updateChapterFilter] = useState();
    const [tree, updateTree] = useState([]);
    const filteredTree = () => {
        if (!chapterFilter) {
            return tree.filter((entry) => !entry.parent);
        }
        return tree.filter((entry) =>
            !entry.parent ||
            entry.value.startsWith(chapterFilter));
    };

    bookToc(selectedBook.meta.slug)
        .then((contents) => {
            if (tree.length === 0) {
                updateTree(flattenTree(contents));
            }
        });

    return ([
        <InvalidMessage key="1" />,
        <select size="10" name="location" key="2"
         ref={inputRef} onChange={updateInvalidMessage}
         required>
            {
                filteredTree().map((entry, index) => (
                    entry.isChapter && !entry.parent ?
                    <ChapterOption
                     entry={entry}
                     chapterFilter={chapterFilter}
                     updateChapterFilter={updateChapterFilter}
                     key={index}
                    /> :
                    <PageOption
                    entry={entry}
                    key={index}
                    />
                ))
            }
        </select>
    ]);
}

function OtherLocationInput({defaultValue='', readOnly=false}) {
    const inputRef = React.createRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);
    const [value, updateValue] = useState(defaultValue);
    function onChange(event) {
        updateValue(event.target.value);
        updateInvalidMessage();
    }

    return ([
        <InvalidMessage key="1" />,
        <input type="text" name="location" key="2"
            placeholder="Describe where you found the error"
            value={value} onChange={onChange}
            ref={inputRef} readOnly={readOnly}
            required
        />
    ]);
}

function DefaultValue({defaultValue}) {
    return (
        <OtherLocationInput defaultValue={defaultValue} readOnly={true} />
    );
}

function NotDefaultValue({selectedBook, defaultValue}) {
    const [isInContent, updateIsInContent] = useState(defaultValue ? false : true);
    const toggle = () => {
        updateIsInContent(!isInContent);
    };
    const Input = isInContent ? TocSelector : OtherLocationInput;

    return [
        <label key="1">
            <input type="checkbox" checked={isInContent} onChange={toggle} />
            In the textbook
        </label>,
        <Input selectedBook={selectedBook} defaultValue={defaultValue} key="2" />
    ];
}

export default function ErrorLocationSelector({selectedBook, defaultValue, readOnly}) {
    const Input = (defaultValue && readOnly) ? DefaultValue : NotDefaultValue;

    return [
        <div className="question" key="1">Where did you find this error?</div>,
        <Input defaultValue={defaultValue} selectedBook={selectedBook} key="2" />
    ];
}
