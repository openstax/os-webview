import React from 'react';
import useSubjectCategoryContext from '~/contexts/subject-category';
import useCategorizedBooks from './use-categorized-books';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import './subjects-listing.scss';

function BookLink({book}) {
    return (
        <a href={`/details/${book.slug}`}>{book.title}</a>
    );
}

function BookList({subject}) {
    const categorizedBooks = useCategorizedBooks();
    const bookList = categorizedBooks[subject.cms];
    const labelId = `${subject.value}-nav`;

    if (!bookList) {
        return null;
    }

    return (
        <nav className="book-list" aria-labelled-by={labelId}>
            <img className="subject-icon" src={subject.icon} role="presentation" />
            <h2 id={labelId}>{subject.html}</h2>
            {bookList?.map((b) => <BookLink key={b.slug} book={b} />)}
            <a href={`/subjects/${subject.value}`}>
                {`View all ${subject.html} books `}
                <FontAwesomeIcon icon={faArrowRight} />
            </a>
        </nav>
    );
}

export default function SubjectsListing() {
    const subjects = useSubjectCategoryContext();

    return (
        <section className="subjects-listing">
            <div className="content">
                {subjects.map((s) => <BookList subject={s} key={s.cms} />)}
            </div>
        </section>
    );
}
