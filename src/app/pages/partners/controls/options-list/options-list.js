import React, {useEffect} from 'react';
import $ from '~/helpers/$';
import {useRefreshable} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './options-list.scss';

function Item({label, value, selected}) {
    const [isSelected, refresh] = useRefreshable(() => selected.includes(value));

    useEffect(() => {
        const cleanup = selected.on('notify', refresh);

        return cleanup;
    }, [selected, value, refresh]);

    function toggleSelected() {
        if ('toggle' in selected) {
            selected.toggle(value);
        } else {
            selected.value = value;
        }
    }

    return (
        <div
            role="option"
            aria-selected={isSelected}
            className="option"
            onClick={toggleSelected}
            tabIndex="0"
            onKeyDown={$.treatSpaceOrEnterAsClick}
        >
            {label}
        </div>
    );
}

export default function OptionsList({items, selected}) {
    return (
        <div role='listbox' className="options-list">
            {
                items.map((item) =>
                    <Item
                        key={item.value}
                        value={item.value}
                        label={item.label}
                        selected={selected}
                    />
                )
            }
        </div>
    );
}
