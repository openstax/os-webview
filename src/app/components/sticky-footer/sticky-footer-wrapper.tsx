import React from 'react';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import {useMainSticky} from '~/helpers/main-class-hooks';
import cn from 'classnames';
import './sticky-footer.scss';

// Note: menus show and hide based on scroll position, which causes the menu to
// show, then hide, then show again when near the top of the page.
function useCollapsedState() {
    const {scrollY, innerHeight} = useWindowContext();
    const distanceFromBottom = document.body.offsetHeight - innerHeight - scrollY;

    return scrollY < 100 || distanceFromBottom < 100;
}

function StickyFooterWrapper({children}: {children: React.ReactNode}) {
    const collapsed = useCollapsedState();

    useMainSticky();

    return (
        <div className={cn('sticky-footer', {collapsed})}>
            {children}
        </div>
    );
}

export default function StickyFooter({children}: {children: React.ReactNode}) {
    return (
        <WindowContextProvider>
            <StickyFooterWrapper children={children} />
        </WindowContextProvider>
    );
}
