import React from 'react';
import useDropdownContext from '../../dropdown-context';
import {isMobileDisplay} from '~/helpers/device';

export default function useMenuControls({
    topRef,
    label
}: {
    topRef: React.MutableRefObject<HTMLAnchorElement>;
    label: string;
}) {
    const {setSubmenuLabel, activeDropdown, setActiveDropdown} =
        useDropdownContext();

    return React.useMemo(() => {
        function closeMenu() {
            setActiveDropdown({});
        }

        function closeDesktopMenu() {
            if (!isMobileDisplay()) {
                closeMenu();
            }
        }

        function openMenu(event: React.MouseEvent) {
            const previousActiveDropdown = activeDropdown;

            event.preventDefault();
            setActiveDropdown(topRef);
            setSubmenuLabel(label);
            if (isMobileDisplay()) {
                (event.target as HTMLElement).blur();
                if (previousActiveDropdown === topRef) {
                    closeMenu();
                }
            }
        }

        function openDesktopMenu(event: React.MouseEvent) {
            event.preventDefault();
            if (!isMobileDisplay()) {
                openMenu(event);
            }
        }

        return {
            closeMenu,
            closeDesktopMenu,
            openMenu,
            openDesktopMenu
        };
    }, [activeDropdown, label, setActiveDropdown, setSubmenuLabel, topRef]);
}
