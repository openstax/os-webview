import React from 'react';
import useSpecificSubjectContext from './context';
import BookTile from '~/components/book-tile/book-tile';
import {ActiveElementContextProvider} from '~/contexts/active-element';
import './book-viewer.scss';


function Category({category: [heading, categoryData]}) {
    const booksObj = categoryData.books;
    const books = Object.values(booksObj);
    const text = categoryData.categoryDescription;

    return (
        <div id={heading} className="category">
            <h2>{heading}</h2>
            <div>{text}</div>
            <div className="books">
                {books.map((b) => <BookTile key={b.id} book={b} />)}
            </div>
        </div>
    );
}

export default function BookViewer() {
    const {subjects, title} = useSpecificSubjectContext();
    const cats = Object.entries(subjects[title].categories);

    return (
        <ActiveElementContextProvider>
            <section className="book-viewer">
                <div className="content">
                    {cats.map((c) => <Category key={c[0]} category={c} />)}
                </div>
            </section>
        </ActiveElementContextProvider>
    );
}
