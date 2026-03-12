import React, {useState, useCallback} from 'react';
import {useDataFromPromise} from '~/helpers/page-data-utils';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import {fetchAllBooks} from '~/models/books';
import {salesforceTitles, SalesforceBook} from '~/helpers/books';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';
import {useIntl} from 'react-intl';
import {useFirstSearchArgument} from './after-form-submit';
import './book-selector.scss';

const spanishPairings: Record<string, string> = {
    Ciencia: 'Science',
    'Ciencias Sociales': 'Social Sciences',
    Empresarial: 'Business',
    'Matemáticas': 'Math'
};

function spanishPartner(subject: string, subjects: string[]) {
    const entry = Object.entries(spanishPairings).find(
        ([, en]) => en === subject
    );

    return entry && subjects.includes(entry[0]) ? entry[0] : undefined;
}

function groupSubjects(subjects: string[]) {
    const spanishSet = new Set(Object.keys(spanishPairings));
    const grouped = new Set<string>();

    return subjects
        .filter((s) => !spanishSet.has(s))
        .map((subject) => {
            const partner = spanishPartner(subject, subjects);

            if (partner) {
                grouped.add(partner);
            }
            return partner
                ? {label: `${subject} / ${partner}`, subjects: [subject, partner]}
                : {label: subject, subjects: [subject]};
        })
        .concat(
            subjects
                .filter((s) => spanishSet.has(s) && !grouped.has(s))
                .map((s) => ({label: s, subjects: [s]}))
        );
}

function SubjectBooks({
    subSubject,
    books,
    name,
    selectedBooks,
    toggleBook,
    limitReached
}: {
    subSubject?: string;
    books: SalesforceBook[];
    name?: string;
    selectedBooks: SalesforceBook[];
    toggleBook: (b: SalesforceBook) => void;
    limitReached: boolean;
}) {
    return (
        <React.Fragment>
            {subSubject && (
                <div className="sub-subject-label">{subSubject}</div>
            )}
            <div className="two-columns">
                {books.map((book) => (
                    <BookCheckbox
                        key={book.value}
                        book={book}
                        name={name}
                        checked={selectedBooks.includes(book)}
                        toggle={toggleBook}
                        disabled={
                            limitReached && !selectedBooks.includes(book)
                        }
                    />
                ))}
            </div>
        </React.Fragment>
    );
}

function Subject({
    group,
    getBooks,
    name,
    selectedBooks,
    toggleBook,
    limitReached,
    forceOpen
}: {
    group: {label: string; subjects: string[]};
    getBooks: (subject: string) => SalesforceBook[];
    name?: string;
    selectedBooks: SalesforceBook[];
    toggleBook: (b: SalesforceBook) => void;
    limitReached: boolean;
    forceOpen: boolean;
}) {
    const [manualOpen, setManualOpen] = useState(false);
    const open = forceOpen || manualOpen;
    const hasSubgroups = group.subjects.length > 1;

    return (
        <div className={`subject-section${open ? ' expanded' : ''}`}>
            <button
                type="button"
                className={`subject-toggle${open ? ' open' : ''}`}
                onClick={() => setManualOpen((v) => !v)}
                aria-expanded={open}
            >
                <span className="field-label">{group.label}</span>
                <span className="toggle-icon" aria-hidden="true">
                    {open ? '\u25B2' : '\u25BC'}
                </span>
            </button>
            {open && (
                <div className="subject-body">
                    {group.subjects.map((sub) => {
                        const books = getBooks(sub);

                        if (books.length === 0) {
                            return null;
                        }
                        return (
                            <SubjectBooks
                                key={sub}
                                subSubject={hasSubgroups ? sub : undefined}
                                books={books}
                                name={name}
                                selectedBooks={selectedBooks}
                                toggleBook={toggleBook}
                                limitReached={limitReached}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function SelectedTag({
    book,
    onRemove
}: {
    book: SalesforceBook;
    onRemove: (b: SalesforceBook) => void;
}) {
    return (
        <span className="selected-tag">
            {book.text}
            <button
                type="button"
                className="remove-tag"
                onClick={() => onRemove(book)}
                aria-label={`Remove ${book.text}`}
            >
                &times;
            </button>
        </span>
    );
}

function useHintText(selectedCount: number, limit?: number) {
    const {formatMessage} = useIntl();

    if (!limit) {
        return 'Select all that apply';
    }
    if (selectedCount === 0) {
        return formatMessage({id: 'book-selector.select'}, {limit});
    }
    if (selectedCount < limit) {
        return formatMessage(
            {id: 'book-selector.select-more'},
            {limit: limit - selectedCount}
        );
    }
    return `Maximum ${limit} selected`;
}

function useBooksToPreselect(
    books: SalesforceBook[],
    preselectedValues?: string[]
) {
    const urlTitle = useFirstSearchArgument();
    const allValues = React.useMemo(() => {
        const vals = preselectedValues ? [...preselectedValues] : [];

        if (urlTitle) {
            vals.push(urlTitle);
        }
        return vals;
    }, [preselectedValues, urlTitle]);

    return React.useMemo(
        () => books.filter((b) => allValues.includes(b.value)),
        [books, allValues]
    );
}

function usePreselection(
    books: SalesforceBook[],
    selectedBooks: SalesforceBook[],
    toggleBook: (b: SalesforceBook) => void,
    preselectedValues?: string[]
) {
    const toSelect = useBooksToPreselect(books, preselectedValues);
    const [done, setDone] = React.useState(false);

    React.useEffect(() => {
        if (done || toSelect.length === 0) {
            return;
        }
        toSelect
            .filter((b) => !selectedBooks.includes(b))
            .forEach(toggleBook);
        setDone(true);
    }, [done, toSelect, selectedBooks, toggleBook]);
}

const defaultIncludeFilter = () => true;

type PropsFromOutside = {
    prompt: string;
    name?: string;
    selectedBooks: SalesforceBook[];
    toggleBook: (b: SalesforceBook) => void;
    limit?: number;
    additionalInstructions?: string;
    includeFilter?: (b: SalesforceBook) => boolean;
    preselectedValues?: string[];
};

type Books = Parameters<typeof salesforceTitles>[0]

function BookSelector({
    data,
    prompt,
    name,
    selectedBooks,
    toggleBook,
    limit,
    additionalInstructions,
    includeFilter = defaultIncludeFilter,
    preselectedValues
}: {
    data: {books: Books};
} & PropsFromOutside) {
    const books = React.useMemo(
        () => salesforceTitles(data.books).filter(includeFilter),
        [data.books, includeFilter]
    );
    const [search, setSearch] = useState('');
    const onSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value),
        []
    );
    const searchLower = search.toLowerCase();
    const subjects = books
        .reduce<string[]>((a, b) => a.concat(b.subjects), [])
        .reduce<string[]>((a, b) => (a.includes(b) ? a : a.concat(b)), []);
    const subjectGroups = React.useMemo(
        () => groupSubjects(subjects),
        [subjects]
    );
    const booksBySubject = useCallback(
        (subject: string) => {
            const subjectBooks = books.filter((b) =>
                b.subjects.includes(subject)
            );

            if (!searchLower) {
                return subjectBooks;
            }
            return subjectBooks.filter((b) =>
                (b.text ?? '').toLowerCase().includes(searchLower)
            );
        },
        [books, searchLower]
    );

    const validationMessage =
        selectedBooks.length > 0 ? '' : 'Please select at least one book';
    const limitReached = limit !== undefined && selectedBooks.length >= limit;

    usePreselection(books, selectedBooks, toggleBook, preselectedValues);

    const hasGroupResults = useCallback(
        (group: {subjects: string[]}) =>
            group.subjects.some((s) => booksBySubject(s).length > 0),
        [booksBySubject]
    );

    return (
        <div className="book-selector">
            <div>
                <h2 className="prompt">{prompt}</h2>
                <div className="hint">
                    {useHintText(selectedBooks.length, limit)}
                </div>
                {additionalInstructions && (
                    <div className="hint">{additionalInstructions}</div>
                )}
            </div>
            <div className="search-and-tags">
                <input
                    type="search"
                    className="book-search"
                    placeholder="Search for a book…"
                    value={search}
                    onChange={onSearchChange}
                />
                {selectedBooks.length > 0 && (
                    <div className="selected-tags">
                        {selectedBooks.map((book) => (
                            <SelectedTag
                                key={book.value}
                                book={book}
                                onRemove={toggleBook}
                            />
                        ))}
                    </div>
                )}
            </div>
            {subjectGroups.map((group) => {
                if (searchLower && !hasGroupResults(group)) {
                    return null;
                }
                return (
                    <Subject
                        key={group.label}
                        group={group}
                        getBooks={booksBySubject}
                        name={name}
                        selectedBooks={selectedBooks}
                        toggleBook={toggleBook}
                        limitReached={limitReached}
                        forceOpen={searchLower.length > 0}
                    />
                );
            })}
            <div className="invalid-message">{validationMessage}</div>
        </div>
    );
}

export function useSelectedBooks() {
    const [selectedBooks, setSelectedBooks] = React.useState<SalesforceBook[]>(
        []
    );
    const toggleBook = React.useCallback(
        (value: SalesforceBook) => {
            if (selectedBooks.includes(value)) {
                setSelectedBooks(selectedBooks.filter((b) => b !== value));
            } else {
                setSelectedBooks([...selectedBooks, value]);
            }
        },
        [selectedBooks]
    );

    return [selectedBooks, toggleBook] as const;
}

export default function BookSelectorLoader(props: PropsFromOutside) {
    const books = useDataFromPromise(fetchAllBooks) as Books | undefined;

    return books ? (
        <BookSelector {...props} data={{books}} />
    ) : (
        <LoadingPlaceholder />
    );
}
