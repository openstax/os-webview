import React from 'react';
import {DropdownContextProvider} from './dropdown-context';
import MenuExpander from './menu-expander/menu-expander';
import UpperMenu from './upper-menu/upper-menu';
import Logo from './logo/logo';
import MainMenu, {MainMenuItems} from './main-menu/main-menu';
import {useToggle} from '~/helpers/data';
import cn from 'classnames';
import trapTab from '~/helpers/trap-tab';
import './menus.scss';
import { treatSpaceOrEnterAsClick } from '~/helpers/events';

export default function Menus() {
    const ref = React.useRef<HTMLDivElement>(null);
    const [active, toggleActive] = useToggle();
    const clickOverlay = React.useCallback(
        (event: React.MouseEvent) => {
            if (event.currentTarget === event.target) {
                toggleActive(false);
            }
        },
        [toggleActive]
    );
    const closeOnEsc = React.useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === 'Escape') {
                toggleActive(false);
            }
        },
        [toggleActive]
    );

    React.useEffect(() => {
        const tabListener = trapTab(ref.current);

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
                    <nav className='meta-nav' aria-label='Upper Menu'>
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
                        toggleActive={toggleActive}
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
