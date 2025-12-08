import React, {useRef} from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useDropdownContext from '../../dropdown-context';
import useWindowContext from '~/contexts/window';
import useNavigateByKey from './use-navigate-by-key';
import useMenuControls from './use-menu-controls';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import {useLocation} from 'react-router-dom';
import usePortalContext from '~/contexts/portal';
import cn from 'classnames';
import './dropdown.scss';

// Using ARIA Disclosure pattern rather than Menubar pattern
// because menubar requires complexity that is not necessary
// for ordinary website navigations, per
// https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-navigation/

export function MenuItem({
    label,
    url,
    local = undefined
}: {
    label: string;
    url: string;
    local?: string;
}) {
    const {innerWidth: _} = useWindowContext();
    const urlPath = url.replace('/view-all', '');
    const {pathname} = useLocation();
    const {portalPrefix} = usePortalContext();

    return (
        <RawHTML
            Tag="a"
            html={label}
            href={`${portalPrefix}${url}`}
            tabIndex={0}
            data-local={local}
            {...(urlPath === pathname ? {'aria-current': 'page'} : {})}
        />
    );
}

function OptionalWrapper({
    isWrapper,
    children
}: {
    isWrapper: boolean;
    children?: React.ReactNode;
}) {
    return isWrapper ? (
        <div className="nav-menu-item dropdown">{children}</div>
    ) : (
        children
    );
}

export default function Dropdown({
    Tag = 'li',
    className = undefined,
    label,
    children,
    excludeWrapper = false,
    navAnalytics
}: {
    Tag?: React.ElementType;
    className?: string;
    label: string;
    children?: React.ReactNode;
    excludeWrapper?: boolean;
    navAnalytics?: string;
}) {
    const topRef = useRef<HTMLAnchorElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const ddId = `ddId-${label}`;
    const {closeMenu, closeDesktopMenu, openMenu, openDesktopMenu} =
        useMenuControls({topRef, label});
    const navigateByKey = useNavigateByKey({
        topRef,
        dropdownRef,
        closeMenu,
        closeDesktopMenu
    });

    return (
        <Tag
            className={className}
            onMouseEnter={openDesktopMenu}
            onMouseLeave={closeDesktopMenu}
            onKeyDown={navigateByKey}
        >
            <OptionalWrapper isWrapper={!excludeWrapper}>
                <DropdownController
                    ddId={ddId}
                    closeDesktopMenu={closeDesktopMenu}
                    closeMenu={closeMenu}
                    openMenu={openMenu}
                    label={label}
                    topRef={topRef}
                />
                <DropdownContents
                    id={ddId}
                    dropdownRef={dropdownRef}
                    navAnalytics={navAnalytics}
                    label={label}
                >
                    {children}
                </DropdownContents>
            </OptionalWrapper>
        </Tag>
    );
}

function DropdownController({
    ddId,
    closeDesktopMenu,
    topRef,
    closeMenu,
    openMenu,
    label
}: {
    ddId: string;
    closeDesktopMenu: () => void;
    topRef: React.RefObject<HTMLAnchorElement>;
    closeMenu: () => void;
    openMenu: (event: React.MouseEvent) => void;
    label: string;
}) {
    const {activeDropdown, prefix} = useDropdownContext();
    const isOpen = activeDropdown === topRef;
    const labelId = `${prefix}-${label}`;
    const toggleMenu = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (activeDropdown === topRef) {
                event.preventDefault();
                closeMenu();
            } else {
                openMenu(event);
            }
        },
        [openMenu, closeMenu, activeDropdown, topRef]
    );
    const closeOnBlur = React.useCallback(
        ({
            currentTarget,
            relatedTarget
        }: React.FocusEvent<HTMLAnchorElement>) => {
            if (currentTarget.parentNode?.contains(relatedTarget)) {
                return;
            }
            closeDesktopMenu();
        },
        [closeDesktopMenu]
    );

    React.useEffect(() => {
        if (isOpen) {
            const handler = ({key}: KeyboardEvent) => {
                if (key === 'Escape') {
                    closeDesktopMenu();
                }
            };

            document.addEventListener('keydown', handler);
            return () => document.removeEventListener('keydown', handler);
        }
        return undefined;
    }, [isOpen, closeDesktopMenu]);

    return (
        <a
            role="button"
            href="."
            aria-expanded={isOpen}
            aria-controls={ddId}
            onBlur={closeOnBlur}
            ref={topRef}
            onClick={toggleMenu}
            onKeyDown={treatSpaceOrEnterAsClick}
            className={cn({'is-open': isOpen})}
            data-analytics-link={isOpen ? 'false' : ''}
            data-analytics-label={label}
        >
            <span id={labelId}>{label}</span>
            <svg
                className="chevron"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 30"
                aria-hidden="true"
            >
                <title> arrow</title>
                <path
                    d="M12,1L26,16,12,31,8,27,18,16,8,5Z"
                    transform="translate(-8 -1)"
                />
            </svg>
        </a>
    );
}

function DropdownContents({
    id,
    label,
    dropdownRef,
    navAnalytics,
    children
}: {
    id: string;
    label: string;
    dropdownRef: React.RefObject<HTMLDivElement>;
    navAnalytics?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="dropdown-container">
            <div
                className="dropdown-menu"
                id={id}
                aria-label={`${label} menu`}
                ref={dropdownRef}
                data-analytics-nav={navAnalytics || undefined}
            >
                {children}
            </div>
        </div>
    );
}
