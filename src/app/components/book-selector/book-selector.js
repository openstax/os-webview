import React, {useState, useRef, useLayoutEffect} from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {salesforceTitles} from '~/models/books';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';
import './book-selector.css';

function Subject({subject, books, name, selectedBooks, toggleBook}) {
    return (
        <div>
            <label className="field-label">{subject}</label>
            <div className="two-columns">
                {
                    books.map((book) =>
                        <BookCheckbox
                            key={book} book={book} name={name}
                            checked={selectedBooks.includes(book)} toggle={toggleBook}
                        />)
                }
            </div>
        </div>
    );
}

function BookSelector({data, prompt, name, selectedBooks, toggleBook, preselectedTitle}) {
    // Use a ref so it doesn't recalculate this every render
    const sfTitlesRef = useRef(salesforceTitles(data.books));
    const books = sfTitlesRef.current;
    const subjects = books.reduce((a, b) => a.concat(b.subjects), [])
        .reduce((a, b) => a.includes(b) ? a : a.concat(b), []);
    const booksBySubject = (subject) => books.filter((b) => b.subjects.includes(subject));
    const validationMessage = selectedBooks.length > 0 ? '' : 'Please select at least one book';

    useLayoutEffect(() => {
        books.filter((book) => preselectedTitle === book.value).forEach(toggleBook);
    }, [preselectedTitle, books]);

    return (
        <div className="book-selector">
            <div>
                <h2 className="prompt">{prompt}</h2>
                <div className="hint">Select all that apply</div>
            </div>
            {
                subjects.map((subject) =>
                    <Subject
                        key={subject}
                        subject={subject} books={booksBySubject(subject)} name={name}
                        selectedBooks={selectedBooks} toggleBook={toggleBook}
                    />
                )
            }
            <div className="invalid-message">{validationMessage}</div>
        </div>
    );
}

export function useSelectedBooks() {
    const [selectedBooks, setSelectedBooks] = useState([]);

    function toggleBook(value) {
        if (selectedBooks.includes(value)) {
            setSelectedBooks(selectedBooks.filter((b) => b !== value));
        } else {
            setSelectedBooks([...selectedBooks, value]);
        }
    }

    return [selectedBooks, toggleBook];
}

export default function BookSelectorLoader(props) {
    return (
        <LoaderPage slug="books" props={props} Child={BookSelector} noCamelCase />
    );
}
