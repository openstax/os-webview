import React from 'react';
import fetchBooks, {salesforceTitles, subjects as getSubjects} from '~/models/books';
import useMultiselectContext from '../multiselect-context.js';
import useToggleContext from '~/components/toggle/toggle-context.js';
import $ from '~/helpers/$';
import './book-options.scss';

function useSalesforceBooks() {
    const [books, setBooks] = React.useState([]);
    const subjects = React.useMemo(() => getSubjects(books).sort(), [books]);

    React.useEffect(() => fetchBooks.then(salesforceTitles).then(setBooks), []);

    return {
        subjects,
        books
    };
}

function BookOption({book}) {
    const {select, deselect, isSelected} = useMultiselectContext();
    const {toggle} = useToggleContext();
    const toggleBook = () => isSelected(book) ? deselect(book) : select(book);

    function onKeyDown(event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            toggle();
        } else {
            $.treatSpaceOrEnterAsClick(event);
        }
    }

    return (
        <span
            className="book-option" tabIndex="0"
            role="option" aria-selected={isSelected(book)}
            onClick={toggleBook}
            onKeyDown={onKeyDown}
        >
            {book.text}
        </span>
    );
}

function SubjectListing({subject, books}) {
    const booksInSubject = books.filter((b) => b.subjects.includes(subject));
    const groupId = `group-${subject}`;

    return (
        <div role="group" aria-labelledby={groupId}>
            <div id={groupId} className="group-header">{subject}</div>
            <div className="option-list">
                {
                    booksInSubject.map((b) => <BookOption key={b.value} book={b} />)
                }
            </div>
        </div>
    );
}

export default function BookOptions() {
    const {subjects, books} = useSalesforceBooks();

    return (
        <div className="book-options">
            {
                subjects.map((s) =>
                    <SubjectListing key={s} subject={s} books={books} />
                )
            }
        </div>
    );
}
