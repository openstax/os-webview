import React from 'react';
import useMultiselectContext from '../multiselect-context';
import useSFBookContext from './sf-book-context';
import type {SalesforceBook} from '~/helpers/books';
import useToggleContext from '~/components/toggle/toggle-context';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import './book-options.scss';


function BookOption({book}: {book: SalesforceBook}) {
    const {select, deselect, isSelected} = useMultiselectContext();
    const {toggle} = useToggleContext();
    const toggleBook = React.useCallback(
        () => isSelected(book) ? deselect(book) : select(book),
        [book, isSelected, deselect, select]
    );
    const onKeyDown = React.useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                toggle();
            } else {
                treatSpaceOrEnterAsClick(event);
            }
        },
        [toggle]
    );

    return (
        <span
            className="book-option" tabIndex={0}
            role="option" aria-selected={isSelected(book)}
            onClick={toggleBook}
            onKeyDown={onKeyDown}
        >
            {book.text}
        </span>
    );
}

function SubjectListing({subject, books}: {
    subject: string;
    books: SalesforceBook[];
}) {
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
    const {subjects, books} = useSFBookContext();

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
