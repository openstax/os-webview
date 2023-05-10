import React from 'react';
import useSubjectCategoryContext from '~/contexts/subject-category';
import useLanguageContext from '~/contexts/language';
import {
    LanguageSelectorWrapper,
    LanguageLink
} from '~/components/language-selector/language-selector';
import {FormattedMessage} from 'react-intl';
import {useLocation} from 'react-router-dom';
import Dropdown, {MenuItem} from './dropdown/dropdown';
import LoginMenu from './login-menu/login-menu';
import GiveButton from '../give-button/give-button';
import './main-menu.scss';

const menuStructure = [
    {
        label: 'Technology',
        items: [
            {label: 'OpenStax Kinetic', url: '/kinetic'},
            // {label: 'OpenStax Assignable', url: '/assignable'},
            {label: 'Partner learning platform', url: '/partners'}
        ]
    },
    {
        label: 'What we do',
        items: [
            {label: 'About Us', url: '/about'},
            {label: 'Team', url: '/team'},
            {label: 'Research', url: '/research'},
            {label: 'K12 Books &amp; Resources', url: '/k12'},
            {
                label: 'Institutional Partnerships',
                url: '/institutional-partnership'
            },
            {
                label: 'Technology Partnerships',
                url: '/openstax-ally-technology-partner-program'
            },
            {label: 'Webinars', url: '/webinars'}
        ]
    }
];

function DropdownOrMenuItem({item}) {
    if ('items' in item) {
        return (
            <Dropdown label={item.label} navAnalytics={`Main Menu (${item.label})`}>
                <MenusFromStructure structure={item.items} />
            </Dropdown>
        );
    }

    return <MenuItem label={item.label} url={item.url} />;
}

function MenusFromStructure({structure}) {
    return (
        <React.Fragment>
            {structure.map((item) => (
                <DropdownOrMenuItem key={item.label} item={item} />
            ))}
        </React.Fragment>
    );
}

function SubjectsMenu() {
    const categories = useSubjectCategoryContext();
    const {language} = useLanguageContext();
    // This will have to be revisited if/when we implement more languages
    const otherLocale = ['en', 'es'].filter((la) => la !== language)[0];
    const {pathname} = useLocation();

    if (!categories.length) {
        return <li>Loading...</li>;
    }

    return (
        <Dropdown className='subjects-dropdown' label='Subjects' navAnalytics="Main Menu (Subjects)">
            {categories.map((obj) => (
                <MenuItem
                    key={obj.value}
                    label={obj.html}
                    url={`/subjects/${obj.value}`}
                />
            ))}
            {pathname.startsWith('/details/books') ? null : (
                <LanguageSelectorWrapper>
                    <FormattedMessage id='view' defaultMessage='View' />{' '}
                    <LanguageLink locale={otherLocale} />
                </LanguageSelectorWrapper>
            )}
        </Dropdown>
    );
}

export default function MainMenu() {
    return (
        <ul className='nav-menu main-menu no-bullets' role='menubar' data-analytics-nav="Main Menu">
            <SubjectsMenu />
            <MenusFromStructure structure={menuStructure} />
            <LoginMenu />
            <li className='give-button-item' role='presentation'>
                <GiveButton />
            </li>
        </ul>
    );
}
