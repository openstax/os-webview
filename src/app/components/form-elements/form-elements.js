import React from 'react';
import useSelectList from '~/helpers/use-select-list';
import {useToggle} from '~/helpers/data';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import cn from 'classnames';
import './form-elements.scss';

export function StyledCheckbox({name, value, checked, onClick, forwardRef}) {
    return (
        <div
            className="styled-checkbox" tabIndex="0"
            role="checkbox" aria-checked={checked}
            onKeyDown={treatSpaceOrEnterAsClick}
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
    const forwardEvent = React.useCallback(
        (event) => {
            if (event.target === event.currentTarget) {
                const newE = new event.constructor(event.type, event);

                childRef.current.dispatchEvent(newE);
            }
        },
        [childRef]
    );

    return (
        <label className="click-forwarding" onClick={forwardEvent} onKeyDown={forwardEvent}>
            {children}
        </label>
    );
}

function Option({text, active, onClick}) {
    const ref = React.useRef();

    React.useLayoutEffect(() => {
        if (active) {
            ref.current.scrollIntoView({block: 'nearest'});
        }
    }, [active]);

    return (
        <div
            className={cn({active})}
            role="option"
            onClick={onClick}
            ref={ref}
        >
            {text}
        </div>
    );
}

function SuggestionList({options, activeIndex, accept}) {
    return (
        <div className="suggestion-list" role="listbox">
            {
                options.map((opt, i) =>
                    <Option
                        key={opt.value} active={activeIndex === i}
                        onClick={() => accept(opt)}
                        text={opt.label}
                    />
                )
            }
        </div>
    );
}

export function FilteringSelect({options, inputProps, accept, accepted}) {
    const [activeIndex, handleKeyDown, setActiveIndex] = useSelectList({
        getItems() {
            return options;
        },
        accept
    });
    const wrappedKeyDown = React.useCallback(
        // Leave space alone
        (event) => {
            if (event.key === ' ') {
                return;
            }
            handleKeyDown(event);
        },
        [handleKeyDown]
    );

    React.useEffect(() => {
        if (accepted) {
            setActiveIndex(-1);
        }
    }, [accepted, setActiveIndex]);

    return (
        <div className="input-with-suggestions">
            <input type="text" {...inputProps} onKeyDown={wrappedKeyDown} />
            {
                !accepted &&
                <SuggestionList options={options} activeIndex={activeIndex} accept={accept} />
            }
        </div>
    );
}
