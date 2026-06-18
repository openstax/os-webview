import React from 'react';
import useSubjectCategoryContext from '~/contexts/subject-category';
import {LanguageLink} from '~/components/language-selector/language-selector';
import usePortalContext from '~/contexts/portal';
import Dropdown from '../dropdown/dropdown';
import './learn-menu.scss';

function SubjectGrid() {
    const categories = useSubjectCategoryContext();
    const {portalPrefix} = usePortalContext();

    if (!categories.length) {
        return null;
    }

    return (
        <ul className="learn-subject-grid no-bullets">
            {categories
                .filter((c) => c.html !== 'K12' && c.value !== 'view-all')
                .map((c) => (
                    <li key={c.value}>
                        <a href={`${portalPrefix}/subjects/${c.value}`} data-analytics-link>
                            {c.html}
                        </a>
                    </li>
                ))}
        </ul>
    );
}

function ExtraLinks() {
    const {portalPrefix} = usePortalContext();

    return (
        <ul className="learn-extra-links no-bullets">
            <li><a href={`${portalPrefix}/assignable`} data-analytics-link>Assignable</a></li>
            <li><a href={`${portalPrefix}/print/`} data-analytics-link>Order a print copy</a></li>
            <li className="learn-language">
                <span className="flag" aria-hidden="true">🇪🇸</span>
                <LanguageLink locale="es" labelPrefix="OpenStax in " />
            </li>
            <li className="learn-language">
                <span className="flag" aria-hidden="true">🇵🇱</span>
                <LanguageLink locale="pl" labelPrefix="OpenStax in " />
            </li>
        </ul>
    );
}

export default function LearnMenu() {
    const {portalPrefix} = usePortalContext();

    return (
        <Dropdown
            className="learn-dropdown"
            label="Learn"
            navAnalytics="Main Menu (Learn)"
            mega
        >
            <a className="learn-library-link" href={`${portalPrefix}/subjects`} data-analytics-link>
                Visit the library
                <span aria-hidden="true" className="arrow">&#8594;</span>
            </a>
            <SubjectGrid />
            <hr />
            <ExtraLinks />
        </Dropdown>
    );
}
