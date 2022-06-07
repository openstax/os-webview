import React from 'react';
import useSubjectsContext from './context';
import useSubjectCategoryContext from '~/contexts/subject-category';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import './subjects-listing.scss';

function CategoryLink({subject, category}) {
    return (
        <a href={`/subjects/${subject}#${category}`}>{category}</a>
    );
}

function BookList({name, data}) {
    const categories = useSubjectCategoryContext();
    const subdir = categories.find((c) => c.html === name)?.value;

    if (data.categories.length === 0) {
        return null;
    }
    const labelId = `${name}-nav`;

    return (
        <nav className="book-list" aria-labelled-by={labelId}>
            <img className="subject-icon" src={data.icon} role="presentation" />
            <h2 id={labelId}>{name}</h2>
            {data.categories.map((c) => <CategoryLink key={c} subject={subdir} category={c} />)}
            {
                data.categories.length > 1 ?
                    <a href={`/subjects/${subdir}/`} className="all-link">
                        {`View all ${name} books `}
                        <FontAwesomeIcon icon={faArrowRight} />
                    </a> : null
            }
        </nav>
    );
}

export default function SubjectsListing() {
    const {subjects} = useSubjectsContext();
    const names = Reflect.ownKeys(subjects);

    return (
        <section className="subjects-listing">
            <div className="content">
                {names.map((name) => <BookList name={name} data={subjects[name]} key={name} />)}
            </div>
        </section>
    );
}
