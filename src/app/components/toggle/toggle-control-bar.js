import React from 'react';
import useToggleContext from './toggle-context';
import {useRefToFocusAfterClose} from './toggle';
import cn from 'classnames';
import {treatKeydownAsClick} from '~/helpers/events';
import './toggle-control-bar.scss';

export default function ToggleControlBar({Indicator, children}) {
    const {isOpen, toggle} = useToggleContext();
    const onKeyDown = React.useCallback(
        (event) => {
            const keyList = isOpen ? ['Escape', 'Enter', ' '] : ['Enter', ' '];

            treatKeydownAsClick(event, keyList);
        },
        [isOpen]
    );
    const focusRef = useRefToFocusAfterClose();

    React.useEffect(() => {
        if (!isOpen) {
            // Restore focus to an input if there is one, otherwise to focusRef
            const focusOn = focusRef.current.querySelector('input') || focusRef.current;

            focusOn.focus();
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
