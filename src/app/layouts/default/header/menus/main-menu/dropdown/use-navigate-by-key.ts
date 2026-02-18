import useDropdownContext from '../../dropdown-context';
import {isMobileDisplay} from '~/helpers/device';
import {assertDefined} from '~/helpers/data';

function findNext(dropdownRef: React.MutableRefObject<HTMLElement | null>) {
    const nextSib = document.activeElement?.nextElementSibling;

    if (nextSib?.matches('a')) {
        return nextSib as HTMLAnchorElement;
    }
    const targets = Array.from(
        assertDefined(dropdownRef.current?.querySelectorAll('a'))
    );
    const idx = targets.indexOf(document.activeElement as HTMLAnchorElement);
    const nextIdx = (idx + 1) % targets.length;

    return targets[nextIdx];
}

function findPrev(
    topRef: React.MutableRefObject<HTMLAnchorElement | null>,
    dropdownRef: React.MutableRefObject<HTMLElement | null>
) {
    const prevSib = document.activeElement?.previousElementSibling;

    if (prevSib?.matches('a')) {
        return prevSib as HTMLAnchorElement;
    }
    const targets = Array.from(
        assertDefined(dropdownRef.current?.querySelectorAll('a'))
    );
    const idx = targets.indexOf(document.activeElement as HTMLAnchorElement);

    if (idx === 0) {
        return topRef.current;
    }
    const prevIdx = (idx + targets.length - 1) % targets.length;

    return targets[prevIdx];
}

export default function useNavigateByKey({
    topRef,
    dropdownRef,
    closeMenu,
    closeDesktopMenu
}: {
    topRef: React.MutableRefObject<HTMLAnchorElement | null>;
    dropdownRef: React.MutableRefObject<HTMLElement | null>;
    closeMenu: () => void;
    closeDesktopMenu: () => void;
}) {
    const {activeDropdown} = useDropdownContext();

    // eslint-disable-next-line complexity
    function navigateByKey(event: React.KeyboardEvent) {
        if (isMobileDisplay()) {
            if (event.key === 'Escape' && activeDropdown.current) {
                const focusReturnsTo = activeDropdown.current;

                closeMenu();
                focusReturnsTo.focus();
                event.stopPropagation();
            }
            if (
                event.key.startsWith('Arrow') ||
                ['Home', 'End'].includes(event.key)
            ) {
                event.preventDefault();
            }
            return;
        }
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (document.activeElement === topRef.current) {
                    dropdownRef.current?.querySelector('a')?.focus();
                } else {
                    findNext(dropdownRef).focus();
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (document.activeElement !== topRef.current) {
                    findPrev(topRef, dropdownRef)?.focus();
                }
                break;
            case 'Escape':
                event.preventDefault();
                event.stopPropagation();
                (event.target as HTMLAnchorElement).blur();
                closeDesktopMenu();
                break;
            default:
                break;
        }
    }

    return navigateByKey;
}
