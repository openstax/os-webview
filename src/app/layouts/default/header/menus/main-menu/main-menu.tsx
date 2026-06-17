import React from 'react';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import Dropdown, {MenuItem} from './dropdown/dropdown';
import LoginMenu from './login-menu/login-menu';
import GiveButton from '../give-button/give-button';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import LearnMenu from './learn-menu/learn-menu';
import './main-menu.scss';

type MenuItemData =
    | {
          name: string;
          menu: MenuItemData[];
      }
    | {
          label: string;
          partial_url: string;
      }
    | object;

function DropdownOrMenuItem({item}: {item: MenuItemData}) {
    if (!('name' in item) && !('label' in item)) {
        return null;
    }
    if ('menu' in item) {
        return (
            <Dropdown
                label={item.name!}
                navAnalytics={`Main Menu (${item.name})`}
            >
                <MenusFromStructure structure={item.menu} />
            </Dropdown>
        );
    }

    return <MenuItem label={item.label} url={item.partial_url} />;
}

function MenusFromStructure({structure}: {structure: MenuItemData[]}) {
    return (
        <React.Fragment>
            {structure.map((item, index) => (
                <DropdownOrMenuItem
                    key={'label' in item ? item.label : index}
                    item={item}
                />
            ))}
        </React.Fragment>
    );
}

function MenusFromCMS() {
    const structure = useDataFromSlug('oxmenus') as MenuItemData[] | undefined;

    if (!structure) {
        return null;
    }

    return <MenusFromStructure structure={structure} />;
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
            <LearnMenu />
            <MenusFromCMS />
            <li className="nav-divider" aria-hidden="true" />
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
