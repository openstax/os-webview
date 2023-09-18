import React from 'react';
import useSubjectCategoryContext from '~/contexts/subject-category';
import useLanguageContext from '~/contexts/language';
import {
    LanguageSelectorWrapper,
    LanguageLink
} from '~/components/language-selector/language-selector';
import {FormattedMessage} from 'react-intl';
import {useLocation} from 'react-router-dom';
import { useDataFromSlug } from '~/helpers/page-data-utils';
import Dropdown, {MenuItem} from './dropdown/dropdown';
import LoginMenu from './login-menu/login-menu';
import GiveButton from '../give-button/give-button';
import './main-menu.scss';

function DropdownOrMenuItem({item}) {
    if ('menu' in item) {
        return (
            <Dropdown label={item.name} navAnalytics={`Main Menu (${item.name})`}>
                <MenusFromStructure structure={item.menu} />
            </Dropdown>
        );
    }

    return <MenuItem label={item.label} url={item.partial_url} />;
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

function MenusFromCMS() {
    const structure = useDataFromSlug('oxmenus');

    if (!structure) {
        return null;
    }

    return (
        <MenusFromStructure structure={structure} />
    );
}

function K12MenuItem() {
    return (
        <MenuItem
            label='For K12 Teachers'
            url='/k12'
        />
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
            {categories.filter((obj) => obj.html !== 'K12').map((obj) => (
                <MenuItem
                    key={obj.value}
                    label={obj.html}
                    url={`/subjects/${obj.value}`}
                />
            ))}
            {language === 'en' ? <K12MenuItem /> : null}
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
            <MenusFromCMS />
            <LoginMenu />
            <li className='give-button-item' role='presentation'>
                <GiveButton />
            </li>
        </ul>
    );
}
