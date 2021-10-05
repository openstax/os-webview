import React from 'react';
import useToggleContext from './toggle-context';
import {useRefToFocusAfterClose} from './toggle';
import cn from 'classnames';
import $ from '~/helpers/$';
import './toggle-control-bar.scss';

export default function ToggleControlBar({Indicator, children}) {
    const {isOpen, toggle} = useToggleContext();
    const onKeyDown = React.useCallback(
        (event) => {
            const keyList = isOpen ? ['Escape', 'Enter', ' '] : ['Enter', ' '];

            $.treatKeydownAsClick(event, keyList);
        },
        [isOpen]
    );
    const focusRef = useRefToFocusAfterClose();

    React.useEffect(() => {
        if (!isOpen) {
            focusRef.current.focus();
        }
    }, [isOpen, focusRef]);

    return (
        <div
            className={cn('toggle-control-bar', {open: isOpen})}
            tabIndex="0"
            onClick={() => toggle()}
            onKeyDown={onKeyDown}
            ref={focusRef}
        >
            <div>{children}</div>
            <Indicator isOpen={isOpen} />
        </div>
    );
}
