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
    const {setSubmenuLabel, setActiveDropdown} = useDropdownContext();

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
            event.preventDefault();
            setActiveDropdown(topRef);
            setSubmenuLabel(label);
            if (isMobileDisplay()) {
                (event.target as HTMLElement).blur();
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
    }, [label, setActiveDropdown, setSubmenuLabel, topRef]);
}
