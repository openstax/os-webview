import React, {useState, useRef, useEffect, useMemo} from 'react';
import useErrataFormContext from '../../errata-form-context';
import managedInvalidMessage from '../InvalidMessage';
import bookToc from '~/models/book-toc';
import {assertNotNull, htmlToText} from '~/helpers/data';
// For LOCAL TESTING when you can't reach Rex; there is another testing section below
// import testData from './test-data';

type TreeEntry = {
    title: string;
    indentLevel: number;
    parent: string;
    value: string;
    expandedValue: string;
    isChapter: boolean;
};

type TocContent = {
    title: string;
    contents?: TocContent[];
};

type ChapterOptionProps = {
    entry: TreeEntry;
    chapterFilter: string | undefined;
    updateChapterFilter: (value: string) => void;
};

type PageOptionProps = {
    entry: TreeEntry;
};

type TocSelectorProps = {
    required: boolean;
    updateValue: (value: string | null) => void;
};

function treeEntry(title: string, indentLevel: number, parent: string, isChapter: boolean): TreeEntry {
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

function flattenTree(contents: TocContent[], indentLevel = 0, parent = ''): TreeEntry[] {
    return contents.map((entry) => {
        const title = htmlToText(entry.title);
        const isChapter = Boolean(entry.contents);
        const thisEntry = treeEntry(title, indentLevel, parent, isChapter);

        return [thisEntry]
            .concat(entry.contents ? flattenTree(entry.contents, indentLevel+1, thisEntry.value) : []);
    }).flat();
}

function ChapterOption({entry, chapterFilter, updateChapterFilter}: ChapterOptionProps) {
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

function PageOption({entry}: PageOptionProps) {
    return (
        <option
            className={`indent-${entry.indentLevel}`}
            value={entry.expandedValue}
        >
            {entry.title}
        </option>
    );
}

function ChapterOrPageOption(passThruOptions: ChapterOptionProps) {
    const {entry} = passThruOptions;

    return (
        entry.isChapter && !entry.parent ?
            <ChapterOption {...passThruOptions} /> :
            <PageOption {...passThruOptions} />
    );
}

function useTocTree(slug: string | undefined, chapterFilter: string | undefined) {
    const [tree, updateTree] = useState<TreeEntry[]>([]);
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
                .then((contents: TocContent[]) => updateTree(flattenTree(contents)));
            // FOR TESTING
            // .catch(() => {
            //     console.info('caught...using testdata', testData);
            //     updateTree(flattenTree(testData.tree.contents));
            // });
        }
    }, [slug]);

    return filteredTree;
}

export default function TocSelector({required, updateValue}: TocSelectorProps) {
    const {selectedBook} = useErrataFormContext();
    const inputRef = useRef<HTMLSelectElement>(null);
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);
    const [chapterFilter, updateChapterFilter] = useState<string>();
    const slug = selectedBook ? selectedBook.slug : undefined;
    const filteredTree = useTocTree(slug, chapterFilter);
    const deselect = React.useCallback(
        () => {
            assertNotNull(inputRef.current).value = '';
            updateValue(null);
        },
        [updateValue]
    );
    const onChange = React.useCallback(
        ({target: {value}}: React.ChangeEvent<HTMLSelectElement>) => updateValue(value),
        [updateValue]
    );

    useEffect(updateInvalidMessage, [required, updateInvalidMessage]);

    return (
        <React.Fragment>
            <label className="question" htmlFor="toc-selector">Where in the book did you find the error?</label>
            <InvalidMessage />
            <select
                id="toc-selector"
                size={10} name="location"
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
