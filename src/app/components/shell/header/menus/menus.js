import React from 'react';
import {DropdownContextProvider} from './dropdown-context';
import MenuExpander from './menu-expander/menu-expander';
import UpperMenu from './upper-menu/upper-menu';
import Logo from './logo/logo';
import MainMenu from './main-menu/main-menu';
import {useToggle} from '~/helpers/data';
import cn from 'classnames';
import './menus.scss';

export default function Menus({open}) {
    const ref = React.useRef();
    const [active, toggle] = useToggle();
    const expandMenu = React.useCallback(
        () => toggle(),
        [toggle]
    );
    const clickOverlay = React.useCallback(
        (event) => {
            if (event.currentTarget === event.target) {
                expandMenu();
            }
        },
        [expandMenu]
    );

    return (
        <DropdownContextProvider>
            <div className={cn('menus desktop', {open})} ref={ref}>
                <nav className="meta-nav">
                    <UpperMenu />
                </nav>
                <nav className="nav" aria-label="Main menu">
                    <div className="container">
                        <Logo />
                        <MainMenu />
                    </div>
                </nav>
            </div>
            <div className={cn('menus mobile', {active})}>
                <Logo />
                <MenuExpander active={active} onClick={expandMenu} />
                <div className="menu-popover-overlay" onClick={clickOverlay}>
                    <div className="menu-popover">
                        <div className="menu-title">Menu</div>
                        <MainMenu />
                        <UpperMenu />
                    </div>
                </div>
            </div>
        </DropdownContextProvider>
    );
}
