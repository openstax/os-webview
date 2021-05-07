import React, {useEffect} from 'react';
import $ from '~/helpers/$';
import './options-list.scss';

function Item({label, value, selected}) {
    const [isSelected, dispatch] = React.useReducer(
        () => selected.includes(value),
        selected.includes(value)
    );

    useEffect(() => {
        const cleanup = selected.on('notify', dispatch);

        return cleanup;
    }, [selected, value]);

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
