import React, {useEffect} from 'react';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import './sticky-footer.scss';
import shellBus from '~/components/shell/shell-bus';
import cn from 'classnames';

// Note: menus show and hide based on scroll position, which causes the menu to
// show, then hide, then show again when near the top of the page.
function useCollapsedState() {
    const {scrollY, innerHeight} = useWindowContext();
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
