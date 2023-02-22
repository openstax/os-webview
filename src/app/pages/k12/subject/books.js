import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import FAQSection from '../shared/faq-section';
import BookTile from '~/components/book-tile/book-tile';
import './books.scss';

function Overview({data}) {
    return (
        <div className="overview">
            <div className="text-content">
                <h1>{data.booksHeading}</h1>
                <RawHTML html={data.booksShortDesc} />
            </div>
            <div className="book-viewer">
                {
                    Object.values(data.books).map((b) => <BookTile key={b.id} book={[b]} />)
                }
            </div>
        </div>
    );
}

function AboutTheBooks({data}) {
    const items = data.books.map(
        (book) => ({title: book.title, contentComponent: <RawHTML html={book.description} />})
    );

    return (
        <div className="about-the-books">
            <FAQSection heading={data.aboutBooksHeading} items={items} />
        </div>
    );
}

function AdoptionBox({data}) {
    return (
        <div className="adoption-box boxed">
            <h2>{data.adoptionHeading}</h2>
            <RawHTML html={data.adoptionText} />
            <a href={data.adoptionLink} className="btn primary">{data.adoptionLinkText}</a>
        </div>
    );
}

export default function Books({data}) {
    return (
        <section className="books">
            <div className="boxed">
                <Overview data={data} />
                <AboutTheBooks data={data} />
                <a className="resource-link" href="#resources">Find Supplemental Resources</a>
                <AdoptionBox data={data} />
            </div>
        </section>
    );
}
