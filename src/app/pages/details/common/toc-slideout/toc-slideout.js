import React from 'react';
import useTOCContext from './context';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import RawHTML from '~/components/jsx-helpers/raw-html';

export default function TOCSlideout({html}) {
    const {toggle} = useTOCContext();

    return (
        <div className="toc-slideout">
            <div className="top-padding">
                <span
                    className="close-toc" role="button" tabIndex="0"
                    onClick={() => toggle()}
                    onKeyDown={treatSpaceOrEnterAsClick}
                >
                    &times;
                </span>
            </div>
            <div className="toc-slideout-contents">
                <div className="toc-drawer">
                    <RawHTML html={html} className="table-of-contents" />
                </div>
            </div>
            <div className="bottom-padding"></div>
        </div>
    );
}
