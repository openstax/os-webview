import React, {useEffect, useContext} from 'react';
import {WindowContextProvider, WindowContext, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './sticky-footer.scss';
import shellBus from '~/components/shell/shell-bus';
import cn from 'classnames';

// Note: menus show and hide based on scroll position, which causes the menu to
// show, then hide, then show again when near the top of the page.
function useCollapsedState() {
    const {scrollY, innerHeight} = useContext(WindowContext);
    const distanceFromBottom = document.body.offsetHeight - innerHeight - scrollY;

    return scrollY < 100 || distanceFromBottom < 100;
}

function StickyFooterBody({leftButton, rightButton}) {
    const collapsed = useCollapsedState();

    useEffect(() => {
        shellBus.emit('with-sticky');

        return () => shellBus.emit('no-sticky');
    }, []);

    return (
        <div className={cn('sticky-footer', {collapsed})}>
            <div className="button-group">
                <a href={leftButton.link} className="btn medium">{leftButton.text}</a>
                {
                    leftButton.description &&
                        <div className="description">{leftButton.description}</div>
                }
                {
                    leftButton.descriptionHtml &&
                        <RawHTML className="description" html={leftButton.descriptionHtml} />
                }
            </div>
            {
                rightButton &&
                    <div className="button-group">
                        <div className="description">{rightButton.description}</div>
                        <a href="{rightButton.link}" className="btn medium">{rightButton.text}</a>
                    </div>
            }
        </div>
    );
}

export default function StickyFooter(model) {
    return (
        <WindowContextProvider>
            <StickyFooterBody {...model} />
        </WindowContextProvider>
    );
}
