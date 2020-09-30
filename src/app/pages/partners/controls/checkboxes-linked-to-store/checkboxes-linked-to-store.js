import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import $ from '~/helpers/$';
import cn from 'classnames';
import './checkboxes-linked-to-store.css';

function Checkbox({label, value, store}) {
    const [checked, setChecked] = useState(store.includes(value));

    useEffect(() => {
        const cleanup = store.on('notify', () => setChecked(store.includes(value)));

        return cleanup;
    }, []);

    return (
        <label className="form-control">
            <span className={cn('indicator', {checked})} tabIndex="0" onKeyDown={$.treatSpaceOrEnterAsClick}>
                <input
                    className="hidden" type="checkbox"
                    value={value}
                    onChange={() => store.toggle(value)}
                />
                <FontAwesomeIcon className="tick" icon="check" />
            </span>
            <span className="label-text">{label}</span>
        </label>
    );
}

export default function CheckboxesLinkedToStore({store, options}) {
    return (
        <div className="checkboxes-linked-to-store">
            {
                options.map((option) =>
                    <Checkbox key={option.value} label={option.label} value={option.value} store={store} />
                )
            }
        </div>
    );
}
