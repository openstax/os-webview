import React, {useState, useCallback} from 'react';
import {useDataFromPromise} from '~/helpers/page-data-utils';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import {fetchAllBooks} from '~/models/books';
import {salesforceTitles, SalesforceBook} from '~/helpers/books';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';
import {useIntl} from 'react-intl';
import {useFirstSearchArgument} from './after-form-submit';
import './book-selector.scss';

function Subject({
    subject,
    books,
    name,
    selectedBooks,
    toggleBook,
    limitReached,
    forceOpen
}: {
    subject: string;
    books: SalesforceBook[];
    name?: string;
    selectedBooks: SalesforceBook[];
    toggleBook: (b: SalesforceBook) => void;
    limitReached: boolean;
    forceOpen: boolean;
}) {
    const hasSelected = books.some((b) => selectedBooks.includes(b));
    const [manualOpen, setManualOpen] = useState(false);
    const open = forceOpen || hasSelected || manualOpen;

    return (
        <div className="subject-section">
            <button
                type="button"
                className={`subject-toggle${open ? ' open' : ''}`}
                onClick={() => setManualOpen((v) => !v)}
                aria-expanded={open}
            >
                <span className="field-label">{subject}</span>
                <span className="toggle-icon" aria-hidden="true">
                    {open ? '\u25B2' : '\u25BC'}
                </span>
            </button>
            {open && (
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
            )}
        </div>
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
            <input
                type="search"
                className="book-search"
                placeholder="Search for a book…"
                value={search}
                onChange={onSearchChange}
            />
            {subjects.map((subject) => {
                const filtered = booksBySubject(subject);

                if (searchLower && filtered.length === 0) {
                    return null;
                }
                return (
                    <Subject
                        key={subject}
                        subject={subject}
                        books={filtered}
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
