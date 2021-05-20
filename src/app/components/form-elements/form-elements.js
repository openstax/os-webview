import React from 'react';
import {useToggle, useSelectList} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import $ from '~/helpers/$';
import cn from 'classnames';
import './form-elements.scss';

export function StyledCheckbox({name, value, checked, onClick, forwardRef}) {
    return (
        <div
            className="styled-checkbox" tabIndex="0"
            role="checkbox" aria-checked={checked}
            onKeyDown={$.treatSpaceOrEnterAsClick}
            onClick={onClick}
            ref={forwardRef}
        >
            {checked && <input type="hidden" name={name} value={value} />}
            {checked && <FontAwesomeIcon icon={faCheck} />}
        </div>
    );
}

export function useStyledCheckbox(initChecked=false) {
    const [checked, toggle] = useToggle(initChecked);

    function SCB({name, value, forwardRef}) {
        return (
            <StyledCheckbox {...{name, value, checked, forwardRef, onClick() {toggle();}}} />
        );
    }

    return [SCB, checked, toggle];
}

export function LabeledElement({label, children}) {
    return (
        <div className="control-group">
            <label className="field-label">{label}</label>
            {children}
        </div>
    );
}

export function ClickForwardingLabel({childRef, children}) {
    function forwardEvent(event) {
        if (event.target === event.currentTarget) {
            $.forwardEvent(event, childRef.current);
        }
    }

    return (
        <label className="click-forwarding" onClick={forwardEvent} onKeyDown={forwardEvent}>
            {children}
        </label>
    );
}

function SuggestionList({options, activeIndex, accept}) {
    return (
        <div className="suggestion-list" role="listbox">
            {
                options.map((opt, i) =>
                    <div
                        key={opt.value}
                        className={cn({active: activeIndex === i})}
                        role="option"
                        onClick={() => accept(opt)}
                    >
                        {opt.label}
                    </div>
                )
            }
        </div>
    );
}

export function FilteringSelect({options, inputProps, onChange}) {
    const [activeIndex, handleKeyDown] = useSelectList({
        getItems() {
            return options;
        },
        accept: onChange
    });

    return (
        <div className="input-with-suggestions">
            <input type="text" {...inputProps} onKeyDown={handleKeyDown} />
            <SuggestionList options={options} activeIndex={activeIndex} accept={onChange} />
        </div>
    );
}
