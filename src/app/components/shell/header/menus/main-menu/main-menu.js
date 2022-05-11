import React from 'react';
import useSubjectCategoryContext from '~/contexts/subject-category';
import useLanguageContext from '~/contexts/language';
import {LanguageSelectorWrapper, LanguageLink} from '~/components/language-selector/language-selector';
import Dropdown, {MenuItem} from './dropdown/dropdown';
import LoginMenu from './login-menu/login-menu';
import GiveButton from '../give-button/give-button';
import './main-menu.scss';

const leadInText = {
    en: 'View',
    es: 'Ver'
};

function SubjectsMenu() {
    const categories = useSubjectCategoryContext();
    const {language} = useLanguageContext();
    // This will have to be revisited if/when we implement more languages
    const otherLocale = ['en', 'es'].filter((la) => la !== language)[0];

    if (!categories.length) {
        return (<li>Loading...</li>);
    }

    return (
        <Dropdown className="subjects-dropdown" label="Subjects">
            {
                categories.map((obj) =>
                    <MenuItem
                        key={obj.value}
                        label={obj.html?.replace('View ', '')}
                        url={`/subjects/${obj.value}`}
                    />
                )
            }
            <LanguageSelectorWrapper>
                {leadInText[language]}{' '}
                <LanguageLink locale={otherLocale} />
            </LanguageSelectorWrapper>
        </Dropdown>
    );
}

export default function MainMenu() {
    return (
        <ul className="nav-menu main-menu no-bullets" role="menubar">
            <SubjectsMenu />
            <Dropdown className="technology-dropdown" label="Technology">
                <MenuItem url="/openstax-tutor" label="OpenStax Tutor" />
                <MenuItem url="/partners" label="OpenStax Tech Scout" />
            </Dropdown>
            <Dropdown className="what-we-do-dropdown" label="What we do">
                <MenuItem url="/about" label="About Us" />
                <MenuItem url="/team" label="Team" />
                <MenuItem url="/research" label="Research" />
                <MenuItem url="/institutional-partnership" label="Institutional Partnerships" />
                <MenuItem url="/general/openstax-ally-technology-partner-program" label="Technology Partnerships" />
                <MenuItem url="/creator-fest" label="Creator Fest" />
            </Dropdown>
            <LoginMenu />
            <li className="give-button-item" role="presentation"><GiveButton /></li>
        </ul>
    );
}
