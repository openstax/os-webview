import React from 'react';
import useSubjectsContext, {SubjectData} from './context';
import useSubjectCategoryContext, {
    ContextValues
} from '~/contexts/subject-category';
import {FormattedMessage} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import {useLocation} from 'react-router-dom';
import './subjects-listing.scss';

export default function SubjectsListing() {
    const {subjects} = useSubjectsContext();
    const names = Reflect.ownKeys(subjects) as Array<string>;

    return (
        <section className="subjects-listing">
            <div className="content">
                {names.map((name) => (
                    <BookList name={name} data={subjects[name]} key={name} />
                ))}
            </div>
        </section>
    );
}

function BookList({name, data}: {name: string; data: SubjectData}) {
    const {pathname} = useLocation();
    const subdir = useSubdir(name);

    if (data.categories.length === 0) {
        return null;
    }
    const labelId = `${name}-nav`;

    return (
        <nav className="book-list" aria-labelledby={labelId}>
            <img className="subject-icon" src={data.icon} role="presentation" />
            <h2 id={labelId}>{name}</h2>
            <menu>
                {data.categories.map((c) => (
                    <CategoryLink key={c} subject={subdir} category={c} />
                ))}
                {data.categories.length > 1 && subdir ? (
                    <li>
                        <a href={`${pathname}/${subdir}`} className="all-link">
                            <FormattedMessage
                                id="subject.viewAll"
                                defaultMessage="View"
                                values={{subject: name}}
                            />
                            <FontAwesomeIcon icon={faArrowRight} />
                        </a>
                    </li>
                ) : null}
            </menu>
        </nav>
    );
}

// This ensures that subdir is never null
// When transitioning between languages, SubjectsContext and SubjectCategoryContext
// both update, and if they are out of sync, subdir isn't found, causing flashing
function useSubdir(name: string) {
    const categories = useSubjectCategoryContext() as ContextValues;
    const [subdir, setSubdir] = React.useState<string>('');

    React.useEffect(() => {
        const newSubdir = categories.find((c) => c.html === name);

        if (newSubdir) {
            setSubdir(newSubdir.value);
        }
    }, [categories, name]);

    return subdir;
}

function CategoryLink({
    subject,
    category
}: {
    subject: string;
    category: string;
}) {
    const {pathname} = useLocation();

    return (
        <li>
            <a
                href={`${pathname}/${subject}#${category}`}
                aria-label={`${category} books in ${subject}`}
            >
                {category}
            </a>
        </li>
    );
}
