import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';

export default function PutAway(
    {onClick, ariaLabel='dismiss'}: {onClick: () => void, ariaLabel?: string}
) {
    const closeUsingKeyboard = React.useCallback(
        (event: React.KeyboardEvent) => {
            if ([' ', 'Escape', 'Enter'].includes(event.key)) {
                onClick();
                event.preventDefault();
                event.stopPropagation();
            }
        },
        [onClick]
    );

    return (
        <span
            className='put-away'
            aria-label={ariaLabel}
            role='button'
            onClick={onClick}
            tabIndex={0}
            onKeyDown={closeUsingKeyboard}
            data-nudge-action='dismissed'
        >
            <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
        </span>
    );
}
