import React from 'react';

export default function PutAway({onClick}: {onClick: () => void}) {
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
            aria-label='dismiss'
            role='button'
            onClick={onClick}
            tabIndex={0}
            onKeyDown={closeUsingKeyboard}
            data-nudge-action='dismissed'
        >
            &times;
        </span>
    );
}
