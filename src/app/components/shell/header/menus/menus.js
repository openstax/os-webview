import React from 'react';
import {DropdownContextProvider} from './dropdown-context';
import MenuExpander from './menu-expander/menu-expander';
import UpperMenu from './upper-menu/upper-menu';
import Logo from './logo/logo';
import MainMenu from './main-menu/main-menu';
import {useToggle} from '~/helpers/data';
import cn from 'classnames';
import trapTab from '~/helpers/trapTab';
import './menus.scss';

export default function Menus({open}) {
    const ref = React.useRef();
    const [active, toggle] = useToggle();
    const expandMenu = React.useCallback(() => toggle(), [toggle]);
    const clickOverlay = React.useCallback(
        (event) => {
            if (event.currentTarget === event.target) {
                expandMenu();
            }
        },
        [expandMenu]
    );
    const closeOnEsc = React.useCallback(
        (event) => {
            if (active && event.key === 'Escape') {
                expandMenu();
            }
        },
        [active, expandMenu]
    );

    React.useEffect(
        () => {
            const tabListener = trapTab(ref.current);

            if (active) {
                document.addEventListener('keydown', tabListener, true);
            } else {
                document.removeEventListener('keydown', tabListener, true);
            }
            return () => window.removeEventListener('keydown', tabListener, true);
        },
        [active]
    );

    return (
        <DropdownContextProvider>
            <div className={cn('menus desktop', {open})}>
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
                        <MainMenu />
                        <UpperMenu />
                    </div>
                </div>
            </div>
        </DropdownContextProvider>
    );
}
