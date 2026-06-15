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
import {useExperimentReader, useExperiment} from '~/helpers/posthog';
import {NAV_K12_ITEM_FLAG} from './nav-experiments';
import Dropdown, {MenuItem} from './dropdown/dropdown';
import LoginMenu from './login-menu/login-menu';
import GiveButton from '../give-button/give-button';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import {RenderNodes} from '../shared/render-nodes';
import {nodesForRegion, type NavNode} from '~/helpers/nav-nodes';
import './main-menu.scss';

function MenusFromCMS() {
    const getVariant = useExperimentReader();
    const structure = useDataFromSlug('oxmenus') as NavNode[] | undefined;

    if (!structure) {
        return null;
    }

    return (
        <RenderNodes
            nodes={nodesForRegion(structure, 'main')}
            getVariant={getVariant}
            navContext="Main Menu"
        />
    );
}

function K12MenuItem() {
    return <MenuItem label="&#127822; For K12 Teachers" url="/k12" />;
}

function SubjectsMenu() {
    const categories = useSubjectCategoryContext();
    const {language} = useLanguageContext();
    const k12TopLevel = Boolean(useExperiment(NAV_K12_ITEM_FLAG));
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
            {language === 'en' && !k12TopLevel ? (
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
            <li className="give-button-item">
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
