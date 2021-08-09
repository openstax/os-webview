import React from 'react';
import useBooks from '~/pages/my-openstax/store/use-books';
import useCollectionContext from '../collection-context';
import './book-list.scss';

function Book({book}) {
    const {setSelectedBook} = useCollectionContext();

    return (
        <div className="cover-with-title">
            <img src={book.coverUrl} role="button" onClick={() => setSelectedBook(book)} />
            <div>{book.label}</div>
        </div>
    );
}

export default function BookList({header, adoptions={}}) {
    const names = Reflect.ownKeys(adoptions);
    const allBooks = useBooks();
    const books = allBooks.filter((b) => names.includes(b.value));

    if (books.length === 0) {
        return null;
    }

    return (
        <div className="book-list-with-header">
            <h3>{header}</h3>
            <div className="book-list">
                {books.map((b) => <Book book={b} key={b.value} />)}
            </div>
        </div>
    );
}
