import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';

export default function PutAway({ onClick }) {
    function closeUsingKeyboard(event) {
        if ([' ', 'Escape', 'Enter'].includes(event.key)) {
            onClick();
            event.preventDefault();
            event.stopPropagation();
        }
    }

    return (
        <span
            className='put-away' role='button' onClick={onClick}
            tabIndex='0' onKeyDown={closeUsingKeyboard}
        >
            <FontAwesomeIcon icon={faTimes} />
        </span>
    );
}
