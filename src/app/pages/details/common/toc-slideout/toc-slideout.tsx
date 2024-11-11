import React from 'react';
import useTOCContext from './context';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import RawHTML from '~/components/jsx-helpers/raw-html';

export default function TOCSlideout({html}: {html: string}) {
    const {isOpen, toggle} = useTOCContext();

    return (
        <div className="toc-slideout">
            <div className="top-padding">
                <span
                    className="close-toc"
                    role="button"
                    tabIndex={0}
                    onClick={() => toggle()}
                    onKeyDown={treatSpaceOrEnterAsClick}
                    aria-controls="toc-drawer"
                    aria-expanded={isOpen}
                >
                    &times;
                </span>
            </div>
            <div className="toc-slideout-contents">
                <div id="toc-drawer" className="toc-drawer">
                    {isOpen && (
                        <RawHTML html={html} className="table-of-contents" />
                    )}
                </div>
            </div>
            <div className="bottom-padding"></div>
        </div>
    );
}
