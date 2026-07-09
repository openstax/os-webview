import React from 'react';
import cn from 'classnames';
import useSubjectCategoryContext from '~/contexts/subject-category';
import useLanguageContext from '~/contexts/language';
import {useStreamlinedNav} from '~/contexts/shared-data';
import {
    LanguageSelectorWrapper,
    LanguageLink
} from '~/components/language-selector/language-selector';
import {FormattedMessage} from 'react-intl';
import {useLocation} from 'react-router-dom';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import {useExperimentReader, type FlagValue} from '~/helpers/posthog';
import {
    NAV_PRODUCTS_LABEL_FLAG,
    isNodeVisible,
    dropdownLabel
} from './nav-experiments';
import Dropdown, {MenuItem} from './dropdown/dropdown';
import LoginMenu from './login-menu/login-menu';
import GiveButton from '../give-button/give-button';
import GiveItem from '../give-item/give-item';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import './main-menu.scss';

type MenuItemData =
    | {
          name: string;
          menu: MenuItemData[];
          key?: string;
          feature_flag?: string;
          flag_value?: string;
      }
    | {
          label: string;
          partial_url: string;
          key?: string;
          feature_flag?: string;
          flag_value?: string;
      }
    | object;

function DropdownOrMenuItem({
    item,
    getVariant
}: {
    item: MenuItemData;
    getVariant: (flag: string) => FlagValue;
}) {
    if (!('name' in item) && !('label' in item)) {
        return null;
    }
    if (!isNodeVisible(item, getVariant)) {
        return null;
    }
    if ('menu' in item) {
        const label = dropdownLabel(item, getVariant(NAV_PRODUCTS_LABEL_FLAG));

        return (
            <Dropdown label={label} navAnalytics={`Main Menu (${item.name})`}>
                <MenusFromStructure structure={item.menu} getVariant={getVariant} />
            </Dropdown>
        );
    }

    return <MenuItem label={item.label} url={item.partial_url} />;
}

function stringProp(item: MenuItemData, prop: 'key' | 'partial_url' | 'name'): string | undefined {
    const value = (item as Record<string, unknown>)[prop];

    return typeof value === 'string' ? value : undefined;
}

function keyFor(item: MenuItemData, index: number): string | number {
    return stringProp(item, 'key') ||
        stringProp(item, 'partial_url') ||
        stringProp(item, 'name') ||
        index;
}

function MenusFromStructure({
    structure,
    getVariant
}: {
    structure: MenuItemData[];
    getVariant: (flag: string) => FlagValue;
}) {
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
    const structure = useDataFromSlug('oxmenus') as MenuItemData[] | undefined;

    if (!structure) {
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
    const streamlined = useStreamlinedNav();

    return (
        <React.Fragment>
            <SubjectsMenu />
            <MenusFromCMS />
            <li className={cn('give-button-item', {streamlined})}>
                {streamlined ? <GiveItem /> : <GiveButton />}
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
