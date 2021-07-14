import React, { useState, useRef, useEffect } from 'react';
import SelectedItems from '~/pages/my-openstax/selected-items/selected-items';
import SuggestionList from '~/pages/my-openstax/suggestion-list/suggestion-list';
import groupBy from 'lodash/groupBy';
import './multiselect.scss';

// Arguably a simple way to set up two-way binding for an input
function useValue(initialValue = null) {
    const [value, setValue] = useState(initialValue);

    function onChange(event) {
        setValue(event.target.value);
    }
    return [value, { value, onChange }, setValue];
}

// options is an array of {label, value}
// filterValue is a string
function filterOptions(options, filterValue) {
    if (!filterValue) {
        return [];
    }
    return options.filter((opt) => opt.label.toLowerCase().includes(filterValue.toLowerCase()));
}

// keyboard controls for operating the suggestion list
function useActiveIndex(items, accept, cancel) {
    const [activeIndex, setActiveIndex] = useState(0);

    function onKeyDown(event) {
        switch (event.key) {
        case 'Enter':
            accept(items[activeIndex]);
            break;
        case 'Escape':
            cancel();
            break;
        case 'ArrowDown':
            setActiveIndex(Math.min(activeIndex + 1, items.length - 1));
            break;
        case 'ArrowUp':
            setActiveIndex(Math.max(activeIndex - 1, 0));
            break;
        default:
            return;
        }
        event.preventDefault();
    }

    return [activeIndex, onKeyDown, setActiveIndex];
}

export function Singleselect({
    options = [],
    initialValue = null, // should be an option: {label, value}
    onChange,
    autoFocus = false,
    placeholder = 'type here',
    onUpdateFilter = null,
    ...otherInputProps
}) {
    const [value, inputProps, setValue] = useValue(initialValue && initialValue.label);
    const [accepted, setAccepted] = useState(Boolean(initialValue));
    const filteredOptions = filterOptions(options, value);
    const accept = (item) => {
        setValue(item.label);
        if (onChange) {
            onChange(item);
        }
        setAccepted(true);
    };
    const updateFilter = (event) => {
        const newValue = event.target.value;

        setValue(newValue);
        setAccepted(false);
        if (onUpdateFilter) {
            onUpdateFilter(newValue);
        }
    };
    const [activeIndex, onKeyDown, setActiveIndex] =
    useActiveIndex(filteredOptions, accept, () => setValue(''));
    const ref = useRef();

    React.useLayoutEffect(() => {
        if (autoFocus) {
            ref.current.focus();
        }
    }, [autoFocus]);

    return (
        <div className='singleselect'>
            <input
                placeholder={placeholder}
                onKeyDown={onKeyDown}
                ref={ref}
                {...inputProps}
                {...otherInputProps}
                onChange={updateFilter}
            />
            {
                !accepted &&
                <SuggestionList
                    items={filteredOptions}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    onSelect={accept}
                />
            }
        </div>
    );
}

/*
options: [{label: displayText, value: internalValue}]
initialSelections: [internalValue]
onChange: fires with updated [internalValue] after add or remove
*/
export default function Multiselect({
    options, initialSelections = [], onChange, autofocus = false
}) {
    const [selectedValues, setSelectedValues] = useState(initialSelections);
    const [filterValue, inputProps, setFilterValue] = useValue();
    const { selectedOptions = [], unselectedOptions = [] } = groupBy(
        options,
        (opt) => selectedValues.includes(opt.value) ? 'selectedOptions' : 'unselectedOptions'
    );
    const filteredOptions = filterOptions(unselectedOptions, filterValue);

    function onSelect(value) {
        setSelectedValues(selectedValues.concat(value));
        setFilterValue('');
    }
    const [activeIndex, onKeyDown, setActiveIndex] =
        useActiveIndex(filteredOptions, onSelect, () => setFilterValue(''));
    const ref = useRef();

    function onRemove(option) {
        setSelectedValues(selectedValues.filter((v) => option.value !== v));
    }

    useEffect(() => {
        if (onChange) {
            onChange(selectedValues);
        }
    }, [selectedValues, onChange]);

    React.useLayoutEffect(() => {
        if (autofocus) {
            ref.current.focus();
        }
    }, [autofocus]);

    return (
        <div className='multiselect'>
            <SelectedItems items={selectedOptions} onRemove={onRemove}>
                <input placeholder='type here' {...{ ...inputProps, onKeyDown }} ref={ref} />
            </SelectedItems>
            <SuggestionList
                items={filteredOptions}
                onSelect={onSelect}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
            />
        </div>
    );
}
