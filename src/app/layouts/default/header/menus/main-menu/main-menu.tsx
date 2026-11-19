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
import {useExperimentReader, type FlagValue} from '~/helpers/posthog';
import {isNodeVisible, type FlagAwareNode} from './nav-experiments';
import Dropdown, {MenuItem} from './dropdown/dropdown';
import LoginMenu from './login-menu/login-menu';
import GiveItem from '../give-item/give-item';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import './main-menu.scss';

type MenuItemData =
    | (FlagAwareNode & {
          name: string;
          menu: MenuItemData[];
      })
    | (FlagAwareNode & {
          label: string;
          partial_url: string;
      })
    | object;

type GetVariant = (flag: string) => FlagValue;

function DropdownOrMenuItem({item, getVariant}: {item: MenuItemData; getVariant: GetVariant}) {
    if (!('name' in item) && !('label' in item)) {
        return null;
    }
    if (!isNodeVisible(item, getVariant)) {
        return null;
    }
    if ('menu' in item) {
        return (
            <Dropdown
                label={item.name!}
                navAnalytics={`Main Menu (${item.name})`}
            >
                <MenusFromStructure structure={item.menu} getVariant={getVariant} />
            </Dropdown>
        );
    }

    return <MenuItem label={item.label} url={item.partial_url} />;
}

function keyFor(item: MenuItemData, index: number): string | number {
    if ('key' in item && item.key) {
        return item.key;
    }
    if ('label' in item) {
        return item.label;
    }
    return index;
}

function MenusFromStructure({structure, getVariant}: {structure: MenuItemData[]; getVariant: GetVariant}) {
    return (
        <React.Fragment>
            {structure.map((item, index) => (
                <DropdownOrMenuItem
                    key={keyFor(item, index)}
                    item={item}
                    getVariant={getVariant}
                />
            ))}
        </React.Fragment>
    );
}

function MenusFromCMS() {
    const getVariant = useExperimentReader();
    const structure = useDataFromSlug<MenuItemData[]>('oxmenus');

    // fetchFromCMS resolves with an {error} object (not an array) when the
    // CMS is unreachable, so a truthiness check alone lets it through to .map.
    if (!Array.isArray(structure)) {
        return null;
    }

    return <MenusFromStructure structure={structure} getVariant={getVariant} />;
}

function K12MenuItem() {
    return <MenuItem label="&#127822; For K12 Teachers" url="/k12" />;
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
        <Dropdown
            className="subjects-dropdown"
            label="Subjects"
            navAnalytics="Main Menu (Subjects)"
        >
            {categories
                .filter(
                    (obj: {html: string; value: string}) => obj.html !== 'K12'
                )
                .map((obj: {html: string; value: string}) => (
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

// eslint-disable-next-line complexity
function navigateWithArrows(event: React.KeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
        case 'ArrowRight':
            event.preventDefault();
            event.stopPropagation();
            (event.target as HTMLElement)
                .closest('li')
                ?.nextElementSibling?.querySelector('a')
                ?.focus();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            event.stopPropagation();
            (event.target as HTMLElement)
                .closest('li')
                ?.previousElementSibling?.querySelector('a')
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
            <li className="give-button-item streamlined">
                <GiveItem />
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
