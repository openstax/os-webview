import React from 'react';
import {DropdownContext, DropdownContextProvider} from './dropdown-context';
import MenuExpander from './menu-expander/menu-expander';
import UpperMenu from './upper-menu/upper-menu';
import Logo from './logo/logo';
import MainMenu from './main-menu/main-menu';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cn from 'classnames';
import './menus.css';

export default function Menus({open}) {
    const ref = React.useRef();
    const [active, toggle] = useToggle();

    function clickOverlay(event) {
        if (event.currentTarget === event.target) {
            toggle();
        }
    }

    return (
        <DropdownContextProvider>
            <div className={cn('menus desktop', {open})} ref={ref}>
                <nav className="meta-nav">
                    <UpperMenu />
                </nav>
                <nav className="nav" role="menubar" aria-label="Main menu">
                    <div className="container">
                        <Logo />
                        <MainMenu />
                    </div>
                </nav>
            </div>
            <div className={cn('menus mobile', {active})}>
                <MenuExpander active={active} onClick={() => toggle()} />
                <Logo />
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
