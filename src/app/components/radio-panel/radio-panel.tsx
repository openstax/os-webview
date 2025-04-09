import React, {useState} from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import cn from 'classnames';

type Item = {
    value: string;
    html: string;
}

type OnChange = (v: string) => void;

function RadioButton({item, isSelected, onChange}: {
    item: Item;
    isSelected: (v: string) => boolean;
    onChange: OnChange;
}) {
    const onClick = () => {
        onChange(item.value);
    };
    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if ([' ', 'Enter'].includes(event.key)) {
            onClick();
        }
    };

    return (
        <div
            className="filter-button" tabIndex={0}
            role="radio" aria-checked={isSelected(item.value)}
            onClick={onClick}
            onKeyDown={onKeyDown}
        >
            {
                isSelected(item.value) &&
                    <span className="on-mobile filter-by">
                        Filter by:
                    </span>
            }
            <RawHTML Tag="span" html={item.html} />
            {
                isSelected(item.value) &&
                    <span className="on-mobile">
                        <FontAwesomeIcon icon={faChevronDown} />
                    </span>
            }
        </div>
    );
}

function RadioPanelJsx({items, selectedValue, onChange}: {
    items: Item[];
    selectedValue: string;
    onChange: OnChange;
}) {
    const isSelected = (val: string) => {
        return val === selectedValue;
    };

    return (
        <React.Fragment>
            {
                items && items.map((item) => (
                    <RadioButton key={item.value} {...{item, isSelected, onChange}} />
                ))
            }
        </React.Fragment>
    );
}

export function RadioPanel({selectedItem, items, onChange}: {
    selectedItem: string;
    items: Item[];
    onChange: OnChange;
}) {
    const [active, setActive] = useState(false);

    function toggleActive() {
        setActive(!active);
    }

    return (
        <div
            role="radiogroup"
            className={cn('filter-buttons', {active})}
            onClick={toggleActive}
        >
            <RadioPanelJsx items={items} selectedValue={selectedItem} onChange={onChange} />
        </div>
    );
}
