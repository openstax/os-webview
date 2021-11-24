import React from 'react';
import useSpecificSubjectContext from './context';
import './book-viewer.scss';

function Book({book: {coverUrl, title, slug}}) {
    return (
        <div className="book-tile">
            <img src={coverUrl} role="presentation" />
            <div className="text-block">
                <a href={`/details/${slug}`}>{title}</a>
            </div>
        </div>
    );
}

function Category({category}) {
    return (
        <div id={category.id} className="category">
            <h2>{category.name}</h2>
            <div>{category.description}</div>
            <div className="books">
                {category.books.map((b) => <Book key={b.slug} book={b} />)}
            </div>
        </div>
    );
}

export default function BookViewer() {
    const {subcategories: cats} = useSpecificSubjectContext();

    console.info('Others?', cats);
    return (
        <section className="book-viewer">
            <div className="content">
                {cats.map((c) => <Category key={c.name} category={c} />)}
            </div>
        </section>
    );
}
