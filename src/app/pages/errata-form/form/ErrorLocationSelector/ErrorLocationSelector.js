import React, {useState, useRef, useEffect} from 'react';
import managedInvalidMessage from '../InvalidMessage.js';
import bookToc from '~/models/book-toc';
import $ from '~/helpers/$';
import css from './ErrorLocationSelector.css';

function treeEntry(title, indentLevel, parent, isChapter) {
    const value = parent ? `${parent}:${title}` : title;
    const expandedValue = value
        .replace(/(^|:)(\d+ )/, (_, before, num) => `${before}Chapter ${num}`)
        .replace(/(:)(\d+\.\d+)/, (_, before, num) => `${before}Section ${num}`)
        .replace(/:(?=\S)/g, ': ');

    return {
        title,
        indentLevel,
        parent,
        value,
        expandedValue,
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
    const onClick = () => {
        const value = chapterFilter === entry.value ? entry.parent : entry.value;

        updateChapterFilter(value);
    };

    return (
        <option
            className="chapter"
            value={entry.expandedValue}
            onClick={onClick}
        >
            {chapterFilter===entry.value ? '–' : '+'} {entry.title}
        </option>
    );
}

function PageOption({entry}) {
    return (
        <option
            className={`indent-${entry.indentLevel}`}
            value={entry.expandedValue}
        >
            {entry.title}
        </option>
    );
}

function TocSelector({selectedBook, required=true, updateValue}) {
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

    function deselect() {
        inputRef.current.value = null;
        updateValue(null);
    }

    function onChange(event) {
        updateValue(event.target.value);
    }

    bookToc(selectedBook.meta.slug)
        .then((contents) => {
            if (tree.length === 0) {
                updateTree(flattenTree(contents));
            }
        });

    useEffect(updateInvalidMessage, [required, updateInvalidMessage]);

    return (
        <React.Fragment>
            <div className="question">Where in the book did you find the error?</div>
            <InvalidMessage />
            <select
                size="10" name="location"
                ref={inputRef} onChange={onChange}
                required={required}
            >
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
            <button type="button" className="btn small" onClick={deselect}>Deselect</button>
        </React.Fragment>
    );
}

function AdditionalLocationInput({defaultValue='', readOnly=false, updateValue, required=true}) {
    const inputRef = useRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);

    function onChange(event) {
        updateValue(event.target.value);
    }

    useEffect(updateInvalidMessage, [required, updateInvalidMessage]);

    return (
        <React.Fragment>
            <div className="question">Additional location information, if applicable</div>
            <InvalidMessage />
            <input
                type="text" name="additional_location_information"
                placeholder="Describe where you found the error"
                value={defaultValue} onChange={onChange}
                ref={inputRef} readOnly={readOnly}
                required={required}
            />
        </React.Fragment>
    );
}

function DefaultValue({defaultValue}) {
    return (
        <AdditionalLocationInput defaultValue={defaultValue} readOnly={true} />
    );
}

function NotDefaultValue({selectedBook, defaultValue}) {
    const [tocV, updateTocV] = useState();
    const [addlV, updateAddlV] = useState(defaultValue);
    const required = () => !tocV && !addlV;

    return (
        <React.Fragment>
            <TocSelector selectedBook={selectedBook} required={required()} updateValue={updateTocV} />
            <AdditionalLocationInput defaultValue={addlV} required={required()} updateValue={updateAddlV} />
        </React.Fragment>
    );
}

export default function ErrorLocationSelector({selectedBook, defaultValue, readOnly}) {
    const Input = (readOnly) ? DefaultValue : NotDefaultValue;

    return (
        <Input defaultValue={defaultValue} selectedBook={selectedBook} />
    );
}
