import React, {useLayoutEffect, useRef, useState} from 'react';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cn from 'classnames';
import './clipped-text.css';

function useIsClipped(el) {
    const [isClipped, setIsClipped] = useState(false);

    if (el) {
        const {clientHeight, scrollHeight} = el;

        if (scrollHeight > clientHeight) {
            setIsClipped(true);
        }
    }

    return isClipped;
}

function useReadMore() {
    const [isOpen, toggle] = useToggle();
    const rmText = isOpen ? 'Show less' : 'Read more';

    function toggleOnClick(event) {
        event.preventDefault();
        toggle();
    }

    return [isOpen, rmText, toggleOnClick];
}

export default function ClippedText({children, className=''}) {
    const ref = useRef();
    const isClipped = useIsClipped(ref.current);
    const [isOpen, rmText, toggle] = useReadMore();
    const style = isOpen ? {maxHeight: 'none'} : {};

    return (
        <React.Fragment>
            <div className={cn('clipped-text', className)} style={style} ref={ref}>
                {children}
            </div>
            {isClipped && <a href="#toggle" onClick={toggle}>{rmText}</a>}
        </React.Fragment>
    );
}
