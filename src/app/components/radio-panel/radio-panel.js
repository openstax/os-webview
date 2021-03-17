import React, {useState} from 'react';
import RadioPanelJsx from './radio-panel.jsx';
import cn from 'classnames';

export function RadioPanel({selectedItem, items, onChange}) {
    const [active, setActive] = useState(false);

    function toggleActive() {
        setActive(!active);
    }

    return (
        <div className={cn('filter-buttons', {active})} onClick={toggleActive}>
            <RadioPanelJsx items={items} selectedValue={selectedItem} onChange={onChange} />
        </div>
    );
}
