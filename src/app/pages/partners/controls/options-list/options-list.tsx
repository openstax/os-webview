import React from 'react';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import {OptionType} from '~/components/form-elements/form-elements';
import './options-list.scss';

export type Selected = {
    includes: (v: unknown) => boolean;
} & (
    {toggle: (v: unknown) => void}
);

function Item({label, value, selected}: OptionType & {selected: Selected}) {
    const isSelected = React.useMemo(
        () => selected.includes(value),
        [selected, value]
    );
    const toggleSelected = React.useCallback(
        () => selected.toggle(value),
        [selected, value]
    );

    return (
        <div
            role="option"
            aria-selected={isSelected}
            className="option"
            onClick={toggleSelected}
            tabIndex={0}
            onKeyDown={treatSpaceOrEnterAsClick}
        >
            {label}
        </div>
    );
}

export default function OptionsList({items, selected}: {
    items: OptionType[];
    selected: Selected;
}) {
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
