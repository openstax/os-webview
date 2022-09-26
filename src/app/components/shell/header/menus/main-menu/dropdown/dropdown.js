import React, {useRef} from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useDropdownContext from '../../dropdown-context';
import $ from '~/helpers/$';
import cn from 'classnames';
import './dropdown.scss';

export function MenuItem({label, url, local}) {
    return (
        <RawHTML
            Tag="a" html={label}
            href={url} tabIndex={-1} data-local={local} role="menuitem"
        />
    );
}

function OptionalWrapper({isWrapper=true, children}) {
    return (
        isWrapper ?
            <div className="nav-menu-item dropdown" role="menu">
                {children}
            </div> : children
    );
}

export default function Dropdown({Tag='li', className, label, children, excludeWrapper=false}) {
    const topRef = useRef();
    const dropdownRef = useRef();
    const dropdownCtx = useDropdownContext();
    const isOpen = dropdownCtx.activeDropdown === topRef;
    const labelId = `menulabel-${label}`;

    function closeMenu() {
        dropdownCtx.setActiveDropdown({});
    }

    function closeDesktopMenu() {
        if (!$.isMobileDisplay()) {
            closeMenu();
        }
    }

    function openMenu(event) {
        const previousActiveDropdown = dropdownCtx.activeDropdown;

        event.preventDefault();
        dropdownCtx.setActiveDropdown(topRef);
        dropdownCtx.setSubmenuLabel(label);
        if ($.isMobileDisplay()) {
            event.target.blur();
            if (previousActiveDropdown === topRef) {
                closeMenu();
            }
        }
    }

    function openDesktopMenu(event) {
        event.preventDefault();
        if (!$.isMobileDisplay()) {
            openMenu(event);
        }
    }

    // eslint-disable-next-line complexity
    function navigateByKey(event) {
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
            // falls through -- these do default behavior and close menu
        case 'Enter':
        case 'Tab':
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
            role="menuitem" aria-haspopup="true"
            labelledby={labelId}
        >
            <OptionalWrapper isWrapper={!excludeWrapper}>
                <a
                    href="." role="menuitem" aria-haspopup="true"
                    onFocus={openDesktopMenu}
                    ref={topRef}
                    onClick={openMenu}
                    className={cn({'is-open': isOpen})}
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
                        role="menu"
                        aria-expanded={isOpen}
                        aria-label={`${label} menu`}
                        ref={dropdownRef}
                    >
                        {children}
                    </div>
                </div>
            </OptionalWrapper>
        </Tag>
    );
}
