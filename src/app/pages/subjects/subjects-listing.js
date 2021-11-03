import React from 'react';
import useSubjectsContext from './context';
import useSubjectCategoryContext from '~/contexts/subject-category';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import './subjects-listing.scss';

const subjectIcons = {
    math: '/images/subjects/subj-icon-calculator.svg',
    science: '/images/subjects/subj-icon-science.svg',
    business: '/images/subjects/subj-icon-business.svg',
    'college-success': '/images/subjects/subj-icon-success.svg',
    humanities: '/images/subjects/subj-icon-humanities.svg',
    'social-sciences': '/images/subjects/subj-icon-social-sciences.svg',
    'high-school': '/images/subjects/subj-icon-high-school.svg'

};

function useCategorizedBooks() {
    const {books} = useSubjectsContext();
    const categories = useSubjectCategoryContext();
    const result = {};
    const addLabels = () => {
        for (const category of categories) {
            if (result[category.cms]) {
                result[category.cms].label = category.html;
            }
        }
    };

    for (const book of books) {
        book.subjects.forEach((cmsCategory) => {
            if (!(cmsCategory in result)) {
                result[cmsCategory] = [];
            }
            if (!result[cmsCategory].includes(book)) {
                result[cmsCategory].push(book);
            }
        });
    }

    addLabels();

    return result;
}

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
            <img className="subject-icon" src={subjectIcons[subject.value]} role="presentation" />
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
