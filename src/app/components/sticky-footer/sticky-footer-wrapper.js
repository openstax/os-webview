import React, {useEffect, useContext} from 'react';
import {WindowContextProvider, WindowContext, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './sticky-footer.css';
import shellBus from '~/components/shell/shell-bus';
import cn from 'classnames';

// Note: menus show and hide based on scroll position, which causes the menu to
// show, then hide, then show again when near the top of the page.
function useCollapsedState() {
    const {scrollY, innerHeight} = useContext(WindowContext);
    const distanceFromBottom = document.body.offsetHeight - innerHeight - scrollY;

    return scrollY < 100 || distanceFromBottom < 100;
}

function StickyFooterWrapper({children}) {
    const collapsed = useCollapsedState();

    useEffect(() => {
        shellBus.emit('with-sticky');

        return () => shellBus.emit('no-sticky');
    }, []);

    return (
        <div className={cn('sticky-footer', {collapsed})}>
            {children}
        </div>
    );
}

export default function StickyFooter({children}) {
    return (
        <WindowContextProvider>
            <StickyFooterWrapper children={children} />
        </WindowContextProvider>
    );
}
