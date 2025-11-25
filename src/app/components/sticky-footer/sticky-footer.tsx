import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import useSharedDataContext from '~/contexts/shared-data';
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

type ButtonModel = {
    link: string;
    text: string;
    description?: string;
    descriptionHtml?: string;
};

type StickyFooterBodyProps = {
    leftButton: ButtonModel;
    rightButton?: ButtonModel;
};

export function StickyFooterBody({leftButton, rightButton}: StickyFooterBodyProps) {
    const collapsed = useCollapsedState();
    const {stickyFooterState: [_, setSFS]} = useSharedDataContext();

    useMainSticky();

    React.useEffect(
        () => {
            setSFS(collapsed);
            return () => setSFS(null);
        },
        [collapsed, setSFS]
    );

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

export default function StickyFooter(model: StickyFooterBodyProps) {
    return (
        <WindowContextProvider>
            <StickyFooterBody {...model} />
        </WindowContextProvider>
    );
}
