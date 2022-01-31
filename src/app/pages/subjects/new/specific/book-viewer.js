import React from 'react';
import useSpecificSubjectContext from './context';
import './book-viewer.scss';

// function Book({book: {coverUrl, title, slug}}) {
//     return (
//         <div className="book-tile">
//             <img src={coverUrl} role="presentation" />
//             <div className="text-block">
//                 <a href={`/details/${slug}`}>{title}</a>
//             </div>
//         </div>
//     );
// }

function Category({category: {heading, text}}) {
    // {category.books.map((b) => <Book key={b.slug} book={b} />)}
    return (
        <div id={heading} className="category">
            <h2>{heading}</h2>
            <div>{text}</div>
            <div className="books">
                <div>do books go here?</div>
            </div>
        </div>
    );
}

export default function BookViewer() {
    const {osTextbookCategories: cats} = useSpecificSubjectContext();

    console.info('Categories?', cats[0]);
    return (
        <section className="book-viewer">
            <div className="content">
                {cats[0].map((c) => <Category key={c.name} category={c} />)}
            </div>
        </section>
    );
}
