import React from 'react';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import './options-list.scss';

function Item({label, value, selected}) {
    const isSelected = React.useMemo(
        () => selected.includes(value),
        [selected, value]
    );
    const toggleSelected = React.useCallback(
        () => {
            if ('toggle' in selected) {
                selected.toggle(value);
            } else {
                selected.setValue(value);
            }
        },
        [selected, value]
    );

    return (
        <div
            role="option"
            aria-selected={isSelected}
            className="option"
            onClick={toggleSelected}
            tabIndex="0"
            onKeyDown={treatSpaceOrEnterAsClick}
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
