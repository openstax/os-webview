import React from 'react';
import useSubjectCategoryContext from '~/contexts/subject-category';
import useLanguageContext from '~/contexts/language';
import {
    LanguageSelectorWrapper,
    LanguageLink
} from '~/components/language-selector/language-selector';
import {FormattedMessage} from 'react-intl';
import {useLocation} from 'react-router-dom';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import Dropdown, {MenuItem} from './dropdown/dropdown';
import LoginMenu from './login-menu/login-menu';
import GiveButton from '../give-button/give-button';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import './main-menu.scss';

type MenuItemData = {
    name?: string;
    label?: string;
    partial_url?: string;
    menu?: MenuItemData[];
};

function DropdownOrMenuItem({item}: {item: MenuItemData}) {
    if (! item.name && ! item.label) {
        return null;
    }
    if ('menu' in item && item.menu) {
        return (
            <Dropdown
                label={item.name!}
                navAnalytics={`Main Menu (${item.name})`}
            >
                <MenusFromStructure structure={item.menu} />
            </Dropdown>
        );
    }

    return <MenuItem label={item.label!} url={item.partial_url!} />;
}

function MenusFromStructure({structure}: {structure: MenuItemData[]}) {
    return (
        <React.Fragment>
            {structure.map((item) => (
                <DropdownOrMenuItem key={item.label} item={item} />
            ))}
        </React.Fragment>
    );
}

function MenusFromCMS() {
    const structure = useDataFromSlug('oxmenus') as MenuItemData[] | null;

    if (!structure) {
        return null;
    }

    return <MenusFromStructure structure={structure} />;
}

function K12MenuItem() {
    return <MenuItem label="&#127822; For K12 Teachers" url="/k12" />;
}

function SubjectsMenu() {
    const categories = useSubjectCategoryContext();
    const {language} = useLanguageContext();
    // This will have to be revisited if/when we implement more languages
    const otherLocale = (['en', 'es'] as const).filter((la) => la !== language)[0];
    const {pathname} = useLocation();

    if (!categories.length) {
        return <li>Loading...</li>;
    }

    return (
        <Dropdown
            className="subjects-dropdown"
            label="Subjects"
            navAnalytics="Main Menu (Subjects)"
        >
            {categories
                .filter((obj) => obj.html !== 'K12')
                .map((obj) => (
                    <MenuItem
                        key={obj.value}
                        label={obj.html}
                        url={`/subjects/${obj.value}`}
                    />
                ))}
            {pathname.startsWith('/details/books') ? null : (
                <React.Fragment>
                    <LanguageSelectorWrapper>
                        <FormattedMessage id="view" defaultMessage="View" />{' '}
                        <LanguageLink locale={otherLocale} />
                    </LanguageSelectorWrapper>
                    <LanguageSelectorWrapper>
                        <FormattedMessage id="view" defaultMessage="View" />{' '}
                        <LanguageLink locale="pl" />
                    </LanguageSelectorWrapper>
                </React.Fragment>
            )}
            {language === 'en' ? (
                <React.Fragment>
                    <hr />
                    <K12MenuItem />
                </React.Fragment>
            ) : null}
        </Dropdown>
    );
}

function navigateWithArrows(event: React.KeyboardEvent<HTMLUListElement>) {
    const target = event.target as HTMLElement;

    switch (event.key) {
        case 'ArrowRight':
            event.preventDefault();
            event.stopPropagation();
            (target
                .closest('li')
                ?.nextElementSibling?.querySelector('a') as HTMLAnchorElement)
                ?.focus();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            event.stopPropagation();
            (target
                .closest('li')
                ?.previousElementSibling?.querySelector('a') as HTMLAnchorElement)
                ?.focus();
            break;
        default:
            break;
    }
    treatSpaceOrEnterAsClick(event);
}

export function MainMenuItems() {
    return (
        <React.Fragment>
            <SubjectsMenu />
            <MenusFromCMS />
            <li className="give-button-item" role="presentation">
                <GiveButton />
            </li>
            <LoginMenu />
        </React.Fragment>
    );
}

export default function MainMenu() {
    return (
        <ul
            className="nav-menu main-menu no-bullets"
            data-analytics-nav="Main Menu"
            onKeyDown={navigateWithArrows}
        >
            <MainMenuItems />
        </ul>
    );
}
