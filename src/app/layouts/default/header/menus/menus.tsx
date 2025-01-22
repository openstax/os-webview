import React from 'react';
import {DropdownContextProvider} from './dropdown-context';
import MenuExpander from './menu-expander/menu-expander';
import UpperMenu from './upper-menu/upper-menu';
import Logo from './logo/logo';
import MainMenu, {MainMenuItems} from './main-menu/main-menu';
import {useToggle} from '~/helpers/data';
import cn from 'classnames';
import trapTab from '~/helpers/trapTab';
import './menus.scss';
import { treatSpaceOrEnterAsClick } from '~/helpers/events';

export default function Menus() {
    const ref = React.useRef<HTMLDivElement>(null);
    const [active, toggle] = useToggle();
    const expandMenu = React.useCallback(() => toggle(), [toggle]);
    const clickOverlay = React.useCallback(
        (event: React.MouseEvent) => {
            if (event.currentTarget === event.target) {
                expandMenu();
            }
        },
        [expandMenu]
    );
    const closeOnEsc = React.useCallback(
        (event: React.KeyboardEvent) => {
            if (active && event.key === 'Escape') {
                expandMenu();
            }
        },
        [active, expandMenu]
    );

    React.useEffect(() => {
        const tabListener = trapTab(ref.current as Element);

        if (active) {
            document.addEventListener('keydown', tabListener, true);
        } else {
            document.removeEventListener('keydown', tabListener, true);
        }
        return () => window.removeEventListener('keydown', tabListener, true);
    }, [active]);

    return (
        <React.Fragment>
            <DropdownContextProvider>
                <div className='menus desktop'>
                    <nav className='meta-nav'>
                        <UpperMenu />
                    </nav>
                    <nav className='nav' aria-label='Main menu'>
                        <div className='container'>
                            <Logo />
                            <MainMenu />
                        </div>
                    </nav>
                </div>
            </DropdownContextProvider>
            <DropdownContextProvider contextValueParameters={{prefix: 'mobile'}}>
                <div
                    className={cn('menus mobile', {active})}
                    ref={ref}
                    onKeyDown={closeOnEsc}
                >
                    <Logo />
                    <MenuExpander
                        active={active}
                        onClick={expandMenu}
                        aria-controls='menu-popover'
                        aria-expanded={active}
                    />
                    <div className='menu-popover-overlay' onClick={clickOverlay}>
                        <div id='menu-popover' className='menu-popover'>
                            <div className='menu-title'>Menu</div>
                            <ul className='no-bullets' onKeyDown={treatSpaceOrEnterAsClick}>
                                <MainMenuItems />
                                <UpperMenu />
                            </ul>
                        </div>
                    </div>
                </div>
            </DropdownContextProvider>
        </React.Fragment>
    );
}
