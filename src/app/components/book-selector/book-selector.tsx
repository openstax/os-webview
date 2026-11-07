import React, {useState, useCallback} from 'react';
import {useDataFromPromise} from '~/helpers/page-data-utils';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import {fetchAllBooks} from '~/models/books';
import {salesforceTitles, subjects as subjectsOf, SalesforceBook} from '~/helpers/books';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';
import {useIntl} from 'react-intl';
import {useFirstSearchArgument} from './after-form-submit';
import {matchesSearch, searchTokens} from './book-search';
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

function SelectedTags({
    books,
    onRemove
}: {
    books: SalesforceBook[];
    onRemove: (b: SalesforceBook) => void;
}) {
    return books.length > 0 ? (
        <div className="selected-tags">
            {books.map((book) => (
                <SelectedTag key={book.value} book={book} onRemove={onRemove} />
            ))}
        </div>
    ) : null;
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

function NoMatches({
    search,
    show,
    onClear
}: {
    search: string;
    show: boolean;
    onClear: () => void;
}) {
    const message = `No books match "${search}".`;

    return (
        <React.Fragment>
            <div className="sr-only" role="status">
                {show && message}
            </div>
            {show && (
                <div className="no-matches">
                    <p>{message}</p>
                    <button type="button" onClick={onClear}>
                        Clear search
                    </button>
                </div>
            )}
        </React.Fragment>
    );
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

function useBookSearch(books: SalesforceBook[]) {
    const [search, setSearch] = useState('');
    const onSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value),
        []
    );
    const clearSearch = useCallback(() => setSearch(''), []);
    const searching = searchTokens(search).length > 0;
    const subjectGroups = React.useMemo(
        () => groupSubjects(subjectsOf(books)),
        [books]
    );
    const booksBySubject = useCallback(
        (subject: string) =>
            books.filter(
                (b) => b.subjects.includes(subject) && matchesSearch(b, search)
            ),
        [books, search]
    );
    const visibleGroups = searching
        ? subjectGroups.filter((group) =>
              group.subjects.some((s) => booksBySubject(s).length > 0)
          )
        : subjectGroups;

    const noMatches = searching && visibleGroups.length === 0;

    return {
        search,
        noMatches,
        onSearchChange,
        clearSearch,
        searching,
        booksBySubject,
        visibleGroups
    };
}

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
    const {
        search,
        onSearchChange,
        clearSearch,
        searching,
        noMatches,
        booksBySubject,
        visibleGroups
    } = useBookSearch(books);

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
            <div className="search-and-tags">
                <input
                    type="search"
                    className="book-search"
                    placeholder="Search for a book…"
                    value={search}
                    onChange={onSearchChange}
                />
                <SelectedTags books={selectedBooks} onRemove={toggleBook} />
            </div>
            <NoMatches
                search={search}
                show={noMatches}
                onClear={clearSearch}
            />
            {visibleGroups.map((group) => (
                <Subject
                    key={group.label}
                    group={group}
                    getBooks={booksBySubject}
                    name={name}
                    selectedBooks={selectedBooks}
                    toggleBook={toggleBook}
                    limitReached={limitReached}
                    forceOpen={searching}
                />
            ))}
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
