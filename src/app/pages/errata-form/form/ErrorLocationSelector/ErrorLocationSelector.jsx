import React, {useState, useRef} from 'react';
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
    };
}

function flattenTree(contents, indentLevel=0, parent='') {
    return contents.map((entry) => {
        const title = $.htmlToText(entry.title);
        const isChapter = Boolean(entry.contents);
        const thisEntry = treeEntry(title, indentLevel, parent, isChapter);

        return [thisEntry]
            .concat(entry.contents ? flattenTree(entry.contents, indentLevel+1, thisEntry.value) : []);
    }).flat();
}

function ChapterOption({entry, chapterFilter, updateChapterFilter}) {
    const onClick = (event) => {
        const value = chapterFilter === event.target.value ? entry.parent : event.target.value;

        updateChapterFilter(value);
    };

    return (
        <option className="chapter"
            value={entry.value}
            onClick={onClick}
        >
            {chapterFilter===entry.value ? '–' : '+'} {entry.title}
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
    const inputRef = useRef();
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

    return (
        <React.Fragment>
            <label>Where in the book did you find the error?</label>
            <InvalidMessage />
            <select size="10" name="location"
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
        </React.Fragment>
    );
}

function OtherLocationInput({defaultValue='', readOnly=false}) {
    const inputRef = useRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);
    const [value, updateValue] = useState(defaultValue);

    function onChange(event) {
        updateValue(event.target.value);
        updateInvalidMessage();
    }

    return (
        <React.Fragment>
            <label>Other location (please provide URL if possible)</label>
            <InvalidMessage />
            <input type="text" name="location"
                placeholder="Describe where you found the error"
                value={value} onChange={onChange}
                ref={inputRef} readOnly={readOnly}
                required
            />
        </React.Fragment>
    );
}

function DefaultValue({defaultValue}) {
    return (
        <OtherLocationInput defaultValue={defaultValue} readOnly={true} />
    );
}

function NotDefaultValue({selectedBook, defaultValue, title}) {
    const [isInContent, updateIsInContent] = useState(defaultValue ? false : true);
    const toggle = () => {
        updateIsInContent(!isInContent);
    };
    const Input = isInContent ? TocSelector : OtherLocationInput;
    const onChange = (event) => {
        updateIsInContent(!isInContent);
    };

    return (
        <React.Fragment>
            <div className="question">
                Did you find this error in the <i>{title}</i> textbook?
            </div>
            <div className="horizontal-group">
                <label>
                    <input type="radio" checked={isInContent} onChange={onChange} />
                    <div className="label-text">Yes</div>
                </label>
                <label>
                    <input type="radio" checked={!isInContent} onChange={onChange} />
                    <div className="label-text">No</div>
                </label>
            </div>
            <Input selectedBook={selectedBook} defaultValue={defaultValue} />
        </React.Fragment>
    );
}

export default function ErrorLocationSelector({selectedBook, defaultValue, readOnly, title}) {
    const Input = (readOnly) ? DefaultValue : NotDefaultValue;

    return (
        <Input defaultValue={defaultValue} selectedBook={selectedBook} title={title}/>
    );
}
