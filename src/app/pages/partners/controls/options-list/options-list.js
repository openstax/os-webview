import React, {useEffect, useState} from 'react';
import $ from '~/helpers/$';
import './options-list.css';

function Item({label, value, selected}) {
    const [isSelected, setIsSelected] = useState(selected.includes(value));

    useEffect(() => {
        const cleanup = selected.on('notify', () => setIsSelected(selected.includes(value)));

        return cleanup;
    }, []);

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
            class="option"
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
