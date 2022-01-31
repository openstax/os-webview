import React from 'react';
import useSubjectsContext from './context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import './subjects-listing.scss';

function CategoryLink({subject, category}) {
    return (
        <a href={`/subjects/${subject}/${category}`}>{category}</a>
    );
}

function BookList({name, data}) {
    if (data.categories.length === 0) {
        return null;
    }
    const labelId = `${name}-nav`;

    return (
        <nav className="book-list" aria-labelled-by={labelId}>
            <img className="subject-icon" src={data.icon} role="presentation" />
            <h2 id={labelId}>{name}</h2>
            {data.categories.map((c) => <CategoryLink key={c} subject={name} category={c} />)}
            <a href={`/subjects/${name}`}>
                {`View all ${name} books `}
                <FontAwesomeIcon icon={faArrowRight} />
            </a>
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
