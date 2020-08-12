import React, {useState, useEffect, useRef} from 'react';
import {useSelectList} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './select.css';

function Option({optionEl, setValue, active}) {
    const classes = `option ${active ? 'active' : ''}`;
    const ref = useRef();

    useEffect(() => {
        if (active) {
            ref.current.scrollIntoView({block: 'nearest'});
        }
    }, [optionEl, active]);

    function onClick(event) {
        setValue(optionEl.value);
        event.stopPropagation();
        event.preventDefault();
    }

    return (
        <li
            className={classes} hidden={optionEl.disabled}
            onClick={onClick}
            ref={ref}
        >
            {optionEl.textContent}
        </li>
    );
}

function SelectProxyFor({selectEl, open, activeIndex, setValue}) {
    const optionsClassList = `options ${open ? ' open' : ''}`;
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const isPlaceholder = selectedOption.disabled;

    return (
        <React.Fragment>
            {
                isPlaceholder ?
                    <span class="item none">{selectedOption.textContent}</span> :
                    <span class="item">{selectedOption.textContent}</span>
            }
            <ul className={optionsClassList}>
                {
                    Array.from(selectEl.options)
                        .map((opt, index) =>
                            <Option
                                optionEl={opt} setValue={setValue}
                                active={activeIndex === index} key={opt}
                            />
                        )
                }
            </ul>
        </React.Fragment>
    );
}

export default function Select({children, placeholder, onChange, ...selectProps}) {
    const [open, setOpen] = useState(false);
    const [selectEl, setSelectEl] = useState();
    const selectRef = useRef();

    function setValue(newValue) {
        selectEl.value = newValue;
        selectEl.dispatchEvent(new Event('change'));
        setOpen(false);
    }
    const [activeIndex, handleKeyDown] = useSelectList({
        getItems: () => selectEl.children,
        accept(item) {
            setValue(item.value);
        },
        cancel() {
            setOpen(false);
        },
        minActiveIndex: placeholder ? 1 : 0
    });

    useEffect(() => {
        setSelectEl(selectRef.current);
    }, []);

    function onClick(event) {
        setOpen(!open);
        event.preventDefault();
        event.stopPropagation();
    }

    function onKeyDown(event) {
        let handled = false;

        if (open) {
            handled = handleKeyDown(event);
        } else if (['Enter', ' '].includes(event.key)) {
            setOpen(true);
            handled = true;
        }
        if (handled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    function onBlur() {
        setOpen(false);
    }

    return (
        <div
            className={`select with-arrow ${open ? 'open' : ''}`}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            tabIndex="0"
        >
            <select {...selectProps} ref={selectRef} onChange={onChange}>
                {
                    placeholder &&
                        <option disabled selected value>{placeholder}</option>
                }
                {children}
            </select>
            {
                Boolean(selectEl) &&
                    <SelectProxyFor
                        selectEl={selectEl}
                        open={open}
                        activeIndex={activeIndex}
                        setValue={setValue}
                    />
            }
        </div>
    );
}
