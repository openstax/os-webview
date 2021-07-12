import React from 'react';
import cn from 'classnames';
import './suggestion-list.scss';

// Lots of requirements here:
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role

function Item({ item, onSelect, active, setActive }) {
    return (
        <li
            className={cn('item', { active })}
            onClick={() => onSelect(item)}
            onMouseMove={setActive}
        >
            {item.label}
        </li>
    );
}

export default function SuggestionList({
    items = [], onSelect,
    activeIndex, setActiveIndex
}) {
    if (items.length === 0) {
        return null;
    }
    return (
        <ul role='listbox' className='suggestion-list'>
            {
                items.map((item, index) => {
                    const active = activeIndex === index;
                    const setActive = () => setActiveIndex(index);

                    return <Item key={item} {...{ item, onSelect, active, setActive }} />;
                })
            }
        </ul>
    );
}
