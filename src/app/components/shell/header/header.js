import React, {useRef} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {DropdownContext, DropdownContextProvider} from './dropdown-context';
import StickyNote from './sticky-note/sticky-note';
import UpperMenu from './upper-menu/upper-menu';
import MainMenu from './main-menu/main-menu';
import $ from '~/helpers/$';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cn from 'classnames';
import './header.css';

function doSkipToContent(event) {
    event.preventDefault();
    const mainEl = document.getElementById('main');
    const focusableItems = Array.from(mainEl.querySelectorAll($.focusable));

    if (focusableItems.length > 0) {
        const target = focusableItems[0];

        $.scrollTo(target);
        target.focus();
    }
}

function SkipToContent() {
    return (
        <a className="skiptocontent" href="#main" onClick={doSkipToContent}>skip to main content</a>
    );
}

function MenuExpander({onClick}) {
    return (
        <button
            className="expand"
            aria-haspopup="true" aria-label="Toggle Meta Navigation Menu"
            tabindex="0"
            onClick={onClick}
        >
            <span />
        </button>
    );
}

function useFullScreenToggle(ref) {
    const [active, toggleActive] = useToggle(false);
    const reconfigure = () => {
        document.body.parentNode.classList.toggle('no-scroll');
        toggleActive();
    };

    React.useEffect(() => {
        const reset = () => {
            toggleActive(false);
            document.body.parentNode.classList.remove('no-scroll');
        };
        const resetOnResize = () => {
            if (!$.isMobileDisplay()) {
                reset();
            }
        };

        window.addEventListener('resize', resetOnResize);
        window.addEventListener('navigate', reset);
        return () => {
            window.removeEventListener('resize', resetOnResize);
            window.removeEventListener('navigate', reset);
        };
    }, [toggleActive]);

    function toggleExpanded() {
        const el = ref.current;

        el.style.transition = 'none';
        if (active) {
            $.fade(el, {fromOpacity: 1, toOpacity: 0}).then(() => {
                reconfigure();
                el.style.opacity = 1;
                el.style.transition = null;
            });
        } else {
            el.style.opacity = 0;
            reconfigure();
            $.fade(el, {fromOpacity: 0, toOpacity: 1}).then(() => {
                el.style.transition = null;
            });
        }
    }

    return [active, toggleExpanded];
}

function SubmenuZone() {
    const ref = useRef();
    const dropdownCtx = React.useContext(DropdownContext);

    React.useEffect(() => {
        const openDropdown = dropdownCtx.activeDropdown.current;
        const isOpen = Boolean(openDropdown);
        const zoneEl = ref.current;

        if (isOpen && $.isMobileDisplay()) {
            const enclosingDropdown = openDropdown.closest('.dropdown');
            const zoneRect = zoneEl.getBoundingClientRect();
            const ddRect = openDropdown.getBoundingClientRect();
            const diff = zoneRect.bottom - ddRect.top - 30;
            const closeMenus = () => dropdownCtx.setActiveDropdown({});

            enclosingDropdown.style.top = `${diff}px`;
            window.addEventListener('resize', closeMenus);
            window.addEventListener('navigate', closeMenus);
            return () => {
                enclosingDropdown.style.removeProperty('top');
                window.removeEventListener('resize', closeMenus);
                window.removeEventListener('navigate', closeMenus);
            };
        }
        return null;
    }, [dropdownCtx, dropdownCtx.activeDropdown]);

    function closeDropdown() {
        dropdownCtx.setActiveDropdown({});
    }

    return (
        <div className="submenu-zone" ref={ref}>
            <a className="close" role="button" onClick={closeDropdown}>
                <svg
                    className="chevron"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 30"
                >
                    <title>arrow</title>
                    <path d="M12,1L26,16,12,31,8,27,18,16,8,5Z" transform="translate(-8 -1)" />
                </svg>
                Back
            </a>
            <div className="menu-title">{dropdownCtx.submenuLabel}</div>
        </div>
    );
}

export function Header() {
    const ref = useRef();
    const [active, onClick] = useFullScreenToggle(ref);
    const dropdownCtx = React.useContext(DropdownContext);
    const open = Boolean(dropdownCtx.activeDropdown.current);

    return (
        <div className={cn('page-header', {active, open})} ref={ref}>
            <SkipToContent />
            <StickyNote />
            <nav className="meta-nav">
                <UpperMenu />
            </nav>
            <nav className="nav" role="menubar" aria-label="Main menu">
                <MainMenu>
                    <MenuExpander onClick={onClick} />
                </MainMenu>
            </nav>
            <SubmenuZone />
        </div>
    );
}

export function HeaderInContext() {
    return (
        <DropdownContextProvider>
            <Header />
        </DropdownContextProvider>
    );
}

const HeaderConstructor = pageWrapper(HeaderInContext);

export default new HeaderConstructor();
