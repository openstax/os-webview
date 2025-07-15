import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import type {Store} from '../../search-context';
import type {OptionType} from '~/components/form-elements/form-elements';
import cn from 'classnames';
import './checkboxes-linked-to-store.scss';

function Checkbox({label, value, store}: {
    label: string;
    value: string;
    store: Store;
}) {
    const checked = React.useMemo(
        () => store.includes(value),
        [store, value]
    );

    return (
        <label className="form-control">
            <span
                role="checkbox"
                aria-label={label}
                className={cn('indicator', {checked})} tabIndex={0} onKeyDown={treatSpaceOrEnterAsClick}>
                <input
                    className="hidden" type="checkbox"
                    value={value}
                    onChange={() => store.toggle(value)}
                />
                <FontAwesomeIcon className="tick" icon={faCheck} />
            </span>
            <span className="label-text">{label}</span>
        </label>
    );
}

export default function CheckboxesLinkedToStore({store, options}: {
    store: Store;
    options: OptionType[];
}) {
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
