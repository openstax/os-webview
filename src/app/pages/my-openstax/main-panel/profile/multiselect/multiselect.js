import React, { useState, useRef, useEffect } from 'react';
import { PutAway } from '../../common';
import './multiselect.scss';

function Selection({ opt, onRemove }) {
    function onClick() {
        onRemove(opt.value);
    }

    return (
        <div className='selection'>
            <span className='text'>{opt.label}</span>
            <PutAway onClick={onClick} />
        </div>
    );
}

function SelectionsAndFilter({ selectedOptions, onRemove, filter, updateFilter }) {
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, [filter]);

    function onChange(event) {
        updateFilter(event.target.value);
    }

    return (
        <div className='selections-and-filter'>
            {
                selectedOptions.map((opt) =>
                    <Selection opt={opt} onRemove={onRemove} key={opt.label} />
                )
            }
            <input
                type='text' placeholder='Type here to filter'
                value={filter} onChange={onChange} ref={inputRef}
            />
        </div>
    );
}

function FilteredOptions({ select, filteredOptions: options, optionClass, setActive }) {
    function onChange(event) {
        const index = event.target.selectedIndex;

        select(options[index].value);
        event.target.selectedIndex = -1;
    }
    function setActiveItem(event) {
        setActive(Array.from(event.target.parentNode.options).indexOf(event.target));
    }

    return (
        <select className='filtered-options' size='5' onChange={onChange}>
            {
                options.map((opt, index) =>
                    <option
                        className={`option ${optionClass(index)}`}
                        onMouseEnter={setActiveItem} key={opt.label}
                    >{opt.label}
                    </option>
                )
            }
        </select>
    );
}

function useFilteredOptionsProps({ filter, options, onSelect }) {
    const [activeOption, updateActiveOption] = useState(0);
    const filteredOptions = filter.length === 0 ? [] :
        options.filter((opt) =>
            opt.label.toLowerCase().includes(filter.toLowerCase())
        );

    return {
        select: onSelect,
        filteredOptions,
        handleKey(key) {
            switch (key) {
            case 'ArrowDown':
                updateActiveOption(Math.min(filteredOptions.length - 1, activeOption + 1));
                return true;
            case 'ArrowUp':
                updateActiveOption(Math.max(0, activeOption - 1));
                return true;
            case 'Enter':
            case ' ':
                onSelect(filteredOptions[activeOption].value);
                return true;
            default:
                return false;
            }
        },
        optionClass(index) {
            return activeOption === index ? 'active' : '';
        },
        setActive: updateActiveOption
    };
}

export default function ({
    putAway, title, prompt, options, selectedOptions, onSelect, onRemove
}) {
    const [filter, updateFilter] = useState('');
    const foProps = useFilteredOptionsProps({
        filter,
        options,
        onSelect
    });

    function closeOnEsc(event) {
        if (foProps.handleKey(event.key)) {
            event.preventDefault();
        }
        if (event.key === 'Escape') {
            putAway();
        }
    }

    return (
        <div className='multiselect-overlay' onKeyDown={closeOnEsc}>
            <div className='multiselect-window'>
                <div className='title-bar'>
                    <span>{title}</span>
                    <PutAway onClick={putAway} />
                </div>
                <div className='ms-body'>
                    <div className='prompt'>{prompt}</div>
                    <SelectionsAndFilter
                        selectedOptions={selectedOptions}
                        filter={filter} updateFilter={updateFilter}
                        onRemove={onRemove}
                    />
                    <FilteredOptions {...foProps} />
                </div>
            </div>
        </div>
    );
}
