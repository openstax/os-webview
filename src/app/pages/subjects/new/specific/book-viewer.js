import React from 'react';
import useSpecificSubjectContext from './context';
import './book-viewer.scss';

function Book({book: [{coverUrl, title, slug}]}) {
    return (
        <div className="book-tile">
            <img src={coverUrl} role="presentation" />
            <div className="text-block">
                <a href={`/details/${slug}`}>{title}</a>
            </div>
        </div>
    );
}

function Category({category: {heading, text}}) {
    const {title, subjects} = useSpecificSubjectContext();
    const booksObj = subjects[title]?.categories[heading]?.books;
    const books = Object.values(booksObj);

    console.info('BOOKS', books);
    return (
        <div id={heading} className="category">
            <h2>{heading}</h2>
            <div>{text}</div>
            <div className="books">
                {books.map((b) => <Book key={b.id} book={b} />)}
            </div>
        </div>
    );
}

export default function BookViewer() {
    const {osTextbookCategories: cats} = useSpecificSubjectContext();

    return (
        <section className="book-viewer">
            <div className="content">
                {cats[0].map((c) => <Category key={c.name} category={c} />)}
            </div>
        </section>
    );
}
