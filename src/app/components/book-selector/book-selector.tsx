import React from 'react';
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
    limitReached
}: {
    subject: string;
    books: SalesforceBook[];
    name: string;
    selectedBooks: SalesforceBook[];
    toggleBook: (b: SalesforceBook) => void;
    limitReached: boolean;
}) {
    return (
        <div>
            <label className="field-label">{subject}</label>
            <div className="two-columns">
                {books.map((book) => (
                    <BookCheckbox
                        key={book.value}
                        book={book}
                        name={name}
                        checked={selectedBooks.includes(book)}
                        toggle={toggleBook}
                        disabled={limitReached && !selectedBooks.includes(book)}
                    />
                ))}
            </div>
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

const defaultIncludeFilter = () => true;

type PropsFromOutside = {
    prompt: string;
    name: string;
    selectedBooks: SalesforceBook[];
    toggleBook: (b: SalesforceBook) => void;
    limit?: number;
    additionalInstructions?: string;
    includeFilter?: () => boolean;
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
    includeFilter = defaultIncludeFilter
}: {
    data: {books: Books};
} & PropsFromOutside) {
    const books = React.useMemo(
        () => salesforceTitles(data.books).filter(includeFilter),
        [data.books, includeFilter]
    );
    const subjects = books
        .reduce<string[]>((a, b) => a.concat(b.subjects), [])
        .reduce<string[]>((a, b) => (a.includes(b) ? a : a.concat(b)), []);
    const booksBySubject = (subject: string) =>
        books.filter((b) => b.subjects.includes(subject));
    const validationMessage =
        selectedBooks.length > 0 ? '' : 'Please select at least one book';
    const limitReached = limit !== undefined && selectedBooks.length >= limit;
    const preselectedTitle = useFirstSearchArgument();
    const preselectedBook = React.useMemo(
        () => books.find((book) => preselectedTitle === book.value),
        [books, preselectedTitle]
    );

    React.useEffect(() => {
        if (preselectedBook && !selectedBooks.includes(preselectedBook)) {
            toggleBook(preselectedBook);
        }
    }, [selectedBooks, preselectedBook, toggleBook]);

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
            {subjects.map((subject) => (
                <Subject
                    key={subject}
                    subject={subject}
                    books={booksBySubject(subject)}
                    name={name}
                    selectedBooks={selectedBooks}
                    toggleBook={toggleBook}
                    limitReached={limitReached}
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
