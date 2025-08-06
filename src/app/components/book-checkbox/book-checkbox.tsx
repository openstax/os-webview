import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import type {SalesforceBook} from '~/helpers/books';
import cn from 'classnames';
import './book-checkbox.scss';

export default function BookCheckbox({
    book,
    name,
    checked,
    toggle,
    disabled
}: {
    book: SalesforceBook;
    name?: string;
    checked: boolean;
    toggle: (b: SalesforceBook) => void;
    disabled?: boolean;
}) {
    const {value, text: label, coverUrl: imageUrl} = book;
    const onClick = React.useCallback(() => {
        if (!disabled) {
            toggle(book);
        }
    }, [disabled, toggle, book]);

    return (
        <div
            className={cn('book-checkbox', {
                checked,
                'has-image': imageUrl,
                disabled
            })}
            onClick={onClick}
        >
            {checked && <input type="hidden" name={name} value={value} />}
            {imageUrl && <img src={imageUrl} alt="" />}
            <label>{label}</label>
            <div
                className="indicator"
                tabIndex={disabled ? -1 : 0}
                role="checkbox"
                aria-label={label}
                aria-checked={checked}
                aria-disabled={disabled}
                onKeyDown={treatSpaceOrEnterAsClick}
            >
                {checked && <FontAwesomeIcon icon={faCheck} />}
            </div>
        </div>
    );
}
