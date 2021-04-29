import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import './common.scss';

const colors = ['blue', 'deep-green', 'gold', 'green', 'light-blue', 'medium-blue', 'orange', 'red'];

export function randomColor() {
    return colors[Math.trunc(Math.random() * colors.length)];
}

export function PlusBox() {
    return (
        <div className='plus-box'>
            <FontAwesomeIcon icon={faPlus} />
        </div>
    );
}

export function AddButton({ label, onClick }) {
    return (
        <button type='button' className='add-button custom' onClick={onClick}>
            <PlusBox />
            <span>{label}</span>
        </button>
    );
}

// Concat trick in case it's just one item
export function DotSeparatedElements({ children }) {
    return (
        <div className='values-and-actions'>
            {
                [].concat(children).map((child, index) =>
                // eslint-disable-next-line react/jsx-key
                    <React.Fragment>
                        {
                            index > 0 && <span className='dot-separator'> &bull; </span>
                        }
                        {child}
                    </React.Fragment>
                )
            }
        </div>
    );
}

export function PutAway({ onClick }) {
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

export function TextInput({ label, name, type = 'text', value, onChange }) {
    return (
        <div className='form-input'>
            <label>{label}</label>
            <input type={type} name={name} value={value} onChange={onChange} />
        </div>
    );
}

export function LoadingSection() {
    return (
        <div>Please hold. Your call is very important to us.</div>
    );
}
