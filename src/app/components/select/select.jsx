import React, {useState, useEffect, useRef} from 'react';
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
        setValue(event.target.dataset.value);
    }

    return (
        <li className={classes} onClick={onClick}
            data-value={optionEl.value}
            ref={ref}
        >
            {optionEl.textContent}
        </li>
    );
}

function SelectProxyFor({selectEl, open, activeIndex, setValue}) {
    const placeholder = selectEl.getAttribute('placeholder');
    const optionsClassList = `options ${open ? ' open' : ''}`;
    const selectionHasBeenMade = selectEl.selectedIndex >= 0;

    return (
        <React.Fragment>
            {
                selectionHasBeenMade ?
                    <span class="item">{selectEl.value}</span> :
                    <span class="item none">{placeholder || 'Please choose an option...'}</span>
            }
            <ul className={optionsClassList}>
                {
                    Array.from(selectEl.options).map((opt, index) =>
                        <Option optionEl={opt}
                            setValue={setValue}
                            active={activeIndex === index}
                        />
                    )
                }
            </ul>
        </React.Fragment>
    );
}

export default function Select({children, ...selectProps}) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [selectEl, setSelectEl] = useState();
    const selectRef = useRef();

    function setValue(newValue) {
        selectEl.value = newValue;
        selectEl.dispatchEvent(new Event('change'));
    }

    useEffect(() => {
        setSelectEl(selectRef.current);
    }, []);
    useEffect(() => {
        if (!open) {
            setActiveIndex(-1);
        }
    }, [open]);

    function onClick(event) {
        setOpen(!open);
        event.preventDefault();
        event.stopPropagation();
    }
    // eslint-disable-next-line complexity
    function onKeyDown(event) {
        let handled = true;

        if (open) {
            switch (event.key) {
            case 'Enter':
            case ' ':
                if (activeIndex > -1) {
                    setValue(selectEl.children[activeIndex].value);
                }
                // eslint-disable-next-line no-fallthrough
            case 'Escape':
                setOpen(false);
                break;
            case 'ArrowDown':
                setActiveIndex(Math.min(activeIndex + 1, selectEl.children.length - 1));
                break;
            case 'ArrowUp':
                setActiveIndex(Math.max(activeIndex - 1, 0));
                break;
            default:
                if (event.key.length === 1) {
                    const letter = event.key.toLowerCase();
                    const values = Array.from(selectEl.children)
                        .map((opt) => opt.value.toLowerCase());
                    let foundIndex = values.findIndex((val, i) =>
                        i > activeIndex && val.startsWith(letter)
                    );

                    if (!(foundIndex > -1)) {
                        foundIndex = values.findIndex((val) => val.startsWith(letter));
                    }
                    if (foundIndex > -1) {
                        setActiveIndex(foundIndex);
                    }
                } else {
                    handled = false;
                }
            }
        } else if (['Enter', ' '].includes(event.key)) {
            setOpen(true);
        } else {
            handled = false;
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
        <div className={`select with-arrow ${open ? 'open' : ''}`}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            tabIndex="0"
        >
            <select {...selectProps} ref={selectRef}>
                {children}
            </select>
            {
                Boolean(selectEl) &&
                    <SelectProxyFor selectEl={selectEl}
                        open={open}
                        activeIndex={activeIndex}
                        setValue={setValue}
                    />
            }
        </div>
    );
}
