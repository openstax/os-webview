import React, {useState, useRef, useEffect, useMemo} from 'react';
import useErrataFormContext from '../../errata-form-context';
import managedInvalidMessage from '../InvalidMessage';
import bookToc from '~/models/book-toc';
import {htmlToText} from '~/helpers/data';
// For LOCAL TESTING when you can't reach Rex; there is another testing section below
// import testData from './test-data';

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
        const title = htmlToText(entry.title);
        const isChapter = Boolean(entry.contents);
        const thisEntry = treeEntry(title, indentLevel, parent, isChapter);

        return [thisEntry]
            .concat(entry.contents ? flattenTree(entry.contents, indentLevel+1, thisEntry.value) : []);
    }).flat();
}

function ChapterOption({entry, chapterFilter, updateChapterFilter}) {
    const expanded = chapterFilter === entry.value;
    const onClick = () => {
        const value = expanded ? entry.parent : entry.value;

        updateChapterFilter(value);
    };

    return (
        <option
            className="chapter"
            value={entry.expandedValue}
            onClick={onClick}
            aria-expanded={expanded}
        >
            {expanded ? '–' : '+'} {entry.title}
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

function ChapterOrPageOption(passThruOptions) {
    const {entry} = passThruOptions;

    return (
        entry.isChapter && !entry.parent ?
            <ChapterOption {...passThruOptions} /> :
            <PageOption {...passThruOptions} />
    );
}

function useTocTree(slug, chapterFilter) {
    const [tree, updateTree] = useState([]);
    const filteredTree = useMemo(
        () => {
            if (!chapterFilter) {
                return tree.filter((entry) => !entry.parent);
            }
            return tree.filter((entry) =>
                !entry.parent ||
                entry.value.startsWith(chapterFilter));
        },
        [tree, chapterFilter]
    );

    useEffect(() => {
        if (slug) {
            bookToc(slug)
                .then((contents) => updateTree(flattenTree(contents)));
            // FOR TESTING
            // .catch(() => {
            //     console.info('caught...using testdata', testData);
            //     updateTree(flattenTree(testData.tree.contents));
            // });
        }
    }, [slug]);

    return filteredTree;
}

export default function TocSelector({required=true, updateValue}) {
    const {selectedBook} = useErrataFormContext();
    const inputRef = useRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);
    const [chapterFilter, updateChapterFilter] = useState();
    const filteredTree = useTocTree(selectedBook.slug, chapterFilter);
    const deselect = React.useCallback(
        () => {
            inputRef.current.value = null;
            updateValue(null);
        },
        [updateValue]
    );
    const onChange = React.useCallback(
        ({target: {value}}) => updateValue(value),
        [updateValue]
    );

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
                    filteredTree.map((entry, index) =>
                        <ChapterOrPageOption
                            key={index}
                            {...{entry, chapterFilter, updateChapterFilter}}
                        />
                    )
                }
            </select>
            <button type="button" className="btn small" onClick={deselect}>Deselect</button>
        </React.Fragment>
    );
}
