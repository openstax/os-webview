import React from 'react';
import useSubjectCategoryContext from '~/contexts/subject-category';
import {LanguageLink} from '~/components/language-selector/language-selector';
import Dropdown from '../dropdown/dropdown';
import './learn-menu.scss';

function SubjectGrid() {
    const categories = useSubjectCategoryContext();

    if (!categories.length) {
        return null;
    }

    return (
        <ul className="learn-subject-grid no-bullets">
            {categories
                .filter((c) => c.html !== 'K12' && c.value !== 'view-all')
                .map((c) => (
                    <li key={c.value}>
                        <a href={`/subjects/${c.value}`} data-analytics-link>
                            {c.html}
                        </a>
                    </li>
                ))}
        </ul>
    );
}

function ExtraLinks() {
    return (
        <ul className="learn-extra-links no-bullets">
            <li><a href="/assignable" data-analytics-link>Assignable</a></li>
            <li><a href="/print/" data-analytics-link>Order a print copy</a></li>
            <li>OpenStax in <LanguageLink locale="es" /></li>
            <li>OpenStax in <LanguageLink locale="pl" /></li>
        </ul>
    );
}

export default function LearnMenu() {
    return (
        <Dropdown
            className="learn-dropdown"
            label="Learn"
            navAnalytics="Main Menu (Learn)"
            mega
        >
            <a className="learn-library-link" href="/subjects" data-analytics-link>
                Visit the library
                <span aria-hidden="true" className="arrow">&#8594;</span>
            </a>
            <SubjectGrid />
            <hr />
            <ExtraLinks />
        </Dropdown>
    );
}
