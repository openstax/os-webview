import React, {useRef} from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useDropdownContext from '../../dropdown-context';
import useWindowContext from '~/contexts/window';
import {isMobileDisplay} from '~/helpers/device';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import {useLocation} from 'react-router-dom';
import cn from 'classnames';
import './dropdown.scss';

// Using ARIA Disclosure pattern rather than Menubar pattern
// because menubar requires complexity that is not necessary
// for ordinary website navigations, per
// https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-navigation/

export function MenuItem({label, url, local}) {
    const {innerWidth: _} = useWindowContext();
    const urlPath = url.replace('/view-all', '');
    const {pathname} = useLocation();

    return (
        <RawHTML
            Tag="a" html={label}
            href={url} tabIndex={0} data-local={local}
            {...(urlPath === pathname ? {'aria-current': 'page'} : {})}
        />
    );
}

function OptionalWrapper({isWrapper=true, children}) {
    return (
        isWrapper ?
            <div className="nav-menu-item dropdown">
                {children}
            </div> : children
    );
}

export default function Dropdown({Tag='li', className, label, children, excludeWrapper=false, navAnalytics}) {
    const topRef = useRef();
    const dropdownRef = useRef();
    const dropdownCtx = useDropdownContext();
    const isOpen = dropdownCtx.activeDropdown === topRef;
    const labelId = `menulabel-${label}`;
    const ddId = `ddId-${label}`;

    function closeMenu() {
        dropdownCtx.setActiveDropdown({});
    }

    function closeDesktopMenu() {
        if (!isMobileDisplay()) {
            closeMenu();
        }
    }

    function closeOnBlur({currentTarget, relatedTarget}) {
        if (currentTarget.parentNode.contains(relatedTarget)) {
            return;
        }
        closeDesktopMenu();
    }

    function openMenu(event) {
        const previousActiveDropdown = dropdownCtx.activeDropdown;

        event.preventDefault();

        dropdownCtx.setActiveDropdown(topRef);
        dropdownCtx.setSubmenuLabel(label);
        if (isMobileDisplay()) {
            event.target.blur();
            if (previousActiveDropdown === topRef) {
                closeMenu();
            }
        }
    }

    function openDesktopMenu(event) {
        event.preventDefault();
        if (!isMobileDisplay()) {
            openMenu(event);
        }
    }

    // eslint-disable-next-line complexity
    function navigateByKey(event) {
        if (isMobileDisplay()) {
            return;
        }
        switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            if (document.activeElement === topRef.current) {
                dropdownRef.current.firstChild.focus();
            } else {
                document.activeElement.nextElementSibling?.focus();
            }
            break;
        case 'ArrowUp':
            event.preventDefault();
            if (document.activeElement !== topRef.current) {
                const focusOn = document.activeElement.previousElementSibling || topRef.current;

                focusOn.focus();
            }
            break;
        case 'Escape':
            event.preventDefault();
            event.target.blur();
            closeDesktopMenu();
            break;
        default:
            break;
        }
    }

    return (
        <Tag
            className={className}
            onMouseEnter={openDesktopMenu}
            onMouseLeave={closeDesktopMenu}
            onKeyDown={navigateByKey}
            role="none"
        >
            <OptionalWrapper isWrapper={!excludeWrapper}>
                <a
                    href="."
                    aria-expanded={isOpen}
                    aria-controls={ddId}
                    onFocus={openDesktopMenu}
                    onBlur={closeOnBlur}
                    ref={topRef}
                    onClick={openMenu}
                    onKeyDown={treatSpaceOrEnterAsClick}
                    className={cn({'is-open': isOpen})}
                    data-analytics-link={isOpen ? 'false' : ''}
                    data-analytics-label={label}
                >
                    <span id={labelId}>{label}</span>
                    <svg className="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 30">
                        <title>arrow</title>
                        <path d="M12,1L26,16,12,31,8,27,18,16,8,5Z" transform="translate(-8 -1)" />
                    </svg>
                </a>
                <div className="dropdown-container">
                    <div
                        className="dropdown-menu"
                        id={ddId}
                        aria-label={`${label} menu`}
                        ref={dropdownRef}
                        data-analytics-nav={navAnalytics || undefined}
                    >
                        {children}
                    </div>
                </div>
            </OptionalWrapper>
        </Tag>
    );
}
