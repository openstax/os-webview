import React from 'react';
import useToggleContext from './toggle-context';
import {useRefToFocusAfterClose} from './toggle';
import cn from 'classnames';
import {treatKeydownAsClick} from '~/helpers/events';
import './toggle-control-bar.scss';

export type ToggleFunction = ({isOpen}: {isOpen: boolean}) => JSX.Element;

export default function ToggleControlBar({
    Indicator,
    children
}: React.PropsWithChildren<{
    Indicator: ToggleFunction;
}>) {
    const {isOpen, toggle} = useToggleContext();
    const [hasBeenOpened, setHasBeenOpened] = React.useState(false);
    const onKeyDown = React.useCallback(
        (event: React.KeyboardEvent) => {
            const keyList = isOpen ? ['Escape', 'Enter', ' '] : ['Enter', ' '];

            treatKeydownAsClick(event, keyList);
        },
        [isOpen]
    );
    const focusRef = useRefToFocusAfterClose();
    const listboxId = `lbid-${Math.floor(Math.random() * 1010101)}`;

    React.useEffect(() => {
        if (isOpen) {
            setHasBeenOpened(true);
        }
    }, [isOpen]);

    // eslint-disable-next-line complexity
    React.useEffect(() => {
        if (hasBeenOpened && !isOpen) {
            // Restore focus to an input if there is one, otherwise to focusRef
            const focusOn =
                focusRef?.current?.querySelector('input') || focusRef.current;

            focusOn?.focus();
        }
    }, [hasBeenOpened, isOpen, focusRef]);

    return (
        <div
            className={cn('toggle-control-bar', {open: isOpen})}
            tabIndex={0}
            onClick={() => toggle()}
            onKeyDown={onKeyDown}
            ref={focusRef}
            role="combobox"
            aria-controls={listboxId}
            aria-haspopup="listbox"
        >
            <div role="listbox" id={listboxId}>
                {children}
            </div>
            <Indicator isOpen={isOpen} />
        </div>
    );
}
