import React from 'react';
import Context from './context';
import $ from '~/helpers/$';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';

export default function TOCSlideout({html}) {
    const tocState = React.useContext(Context);

    return (
        <div className="toc-slideout">
            <div className="top-padding">
                <span
                    className="close-toc" role="button" tabIndex="0"
                    onClick={() => tocState.toggle()}
                    onKeyDown={$.treatSpaceOrEnterAsClick}
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
