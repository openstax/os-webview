import React from 'react';
import {useDataFromPromise} from '~/helpers/page-data-utils';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import {fetchAllBooks} from '~/models/books';
import afterFormSubmit from './after-form-submit';
import {salesforceTitles} from '~/helpers/books';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';
import {useNavigate, useLocation} from 'react-router-dom';
import {useIntl} from 'react-intl';
import './book-selector.scss';

function Subject({
    subject,
    books,
    name,
    selectedBooks,
    toggleBook,
    limitReached
}) {
    return (
        <div>
            <label className="field-label">{subject}</label>
            <div className="two-columns">
                {books.map((book) => (
                    <BookCheckbox
                        key={book}
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

function useHintText(selectedCount, limit) {
    const {formatMessage} = useIntl();

    if (!limit) {
        return 'Select all that apply';
    }
    if (selectedCount === 0) {
        return formatMessage({id: 'book-selector.select'}, {limit});
    }
    if (selectedCount < limit) {
        return formatMessage({id: 'book-selector.select-more'}, {limit: limit - selectedCount});
    }
    return `Maximum ${limit} selected`;
}

const defaultIncludeFilter = () => true;

function BookSelector({
    data,
    prompt,
    name,
    selectedBooks,
    toggleBook,
    preselectedTitle,
    limit,
    additionalInstructions,
    includeFilter = defaultIncludeFilter
}) {
    const books = React.useMemo(
        () => salesforceTitles(data.books).filter(includeFilter),
        [data.books, includeFilter]
    );
    const subjects = books
        .reduce((a, b) => a.concat(b.subjects), [])
        .reduce((a, b) => (a.includes(b) ? a : a.concat(b)), []);
    const booksBySubject = (subject) =>
        books.filter((b) => b.subjects.includes(subject));
    const validationMessage =
        selectedBooks.length > 0 ? '' : 'Please select at least one book';
    const limitReached = selectedBooks.length >= limit;
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
    const [selectedBooks, setSelectedBooks] = React.useState([]);
    const toggleBook = React.useCallback(
        (value) => {
            if (selectedBooks.includes(value)) {
                setSelectedBooks(selectedBooks.filter((b) => b !== value));
            } else {
                setSelectedBooks([...selectedBooks, value]);
            }
        },
        [selectedBooks]
    );

    return [selectedBooks, toggleBook];
}

export function useFirstSearchArgument() {
    const {search} = useLocation();

    return decodeURIComponent(search.substr(1).replace(/&.*/, ''));
}

export function useAfterSubmit(selectedBooksRef) {
    const navigate = useNavigate();
    const preselectedTitle = useFirstSearchArgument();

    return React.useCallback(
        () =>
            afterFormSubmit(
                navigate,
                preselectedTitle,
                selectedBooksRef.current
            ),
        [navigate, selectedBooksRef, preselectedTitle]
    );
}

export default function BookSelectorLoader(props) {
    const books = useDataFromPromise(fetchAllBooks);

    return books ? <BookSelector {...props} data={{books}} /> : <LoadingPlaceholder />;
}
