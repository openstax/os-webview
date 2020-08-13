import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import './book-checkbox.css';

// eslint-disable-next-line complexity
export default function BookCheckbox({book, name, checked, toggle}) {
    const {
        value,
        text: label,
        coverUrl: imageUrl
    } = book;

    function onClick() {
        toggle(book);
    }
    function onKeyDown(event) {
        if ([' ', 'Enter'].includes(event.key)) {
            toggle(book);
            event.preventDefault();
        }
    }

    return (
        <div className={cn('book-checkbox', {checked, 'has-image': imageUrl})} onClick={onClick} >
            {checked && <input type="hidden" name={name} value={value} />}
            {imageUrl && <img src={imageUrl} alt="" />}
            <label>{label}</label>
            <div
                className="indicator" tabIndex="0"
                role="checkbox" aria-checked={checked}
                onKeyDown={onKeyDown}
            >
                {checked && <FontAwesomeIcon icon="check" />}
            </div>
        </div>
    );
}
