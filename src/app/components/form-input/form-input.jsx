import React, {useState, useRef, useEffect, useLayoutEffect} from 'react';
import {useSelectList} from '~/components/jsx-helpers/jsx-helpers.jsx';
import shellBus from '~/components/shell/shell-bus';
import './form-input.css';

function SuggestionItem({value, accept, index, activeIndex, setActiveIndex}) {
    const classList = ['suggestion'];
    const ref = useRef();
    const active = index === activeIndex;

    if (active) {
        classList.push('active');
    }
    useLayoutEffect(() => {
        if (active) {
            ref.current.scrollIntoView({block: 'nearest'});
        }
    }, [active]);

    return (
        <div
            className={classList.join(' ')} ref={ref}
            onClick={() => accept(value)}
            onMouseMove={setActiveIndex(index)}
        >{value}</div>
    );
}


function useMatches(pattern, suggestions=[]) {
    const matches = pattern.length > 1 ?
        suggestions.filter((s) => s.toLowerCase().includes(pattern)) :
        [];
    const exactMatch = matches.includes(pattern) ||
        (matches.length === 1 && pattern === matches[0].toLowerCase());

    return [matches, exactMatch];
}

function SuggestionBox({matches, exactMatch, accepted, accept, activeIndex, setActiveIndex}) {
    if (exactMatch) {
        accept(matches[0]);
    }
    useLayoutEffect(() => {
        shellBus.emit('with-sticky');

        return () => shellBus.emit('no-sticky');
    }, []);

    return (
        <div className="suggestions">
            <div className="suggestion-box">
                {
                    !exactMatch && !accepted && matches.map((match, i) =>
                        <SuggestionItem
                            value={match} accept={accept} index={i}
                            activeIndex={activeIndex} setActiveIndex={setActiveIndex}
                            key={match}
                        />)
                }
            </div>
        </div>
    );
}

function ValidatingInput({value, inputProps, onChange}) {
    const [validationMessage, setValidationMessage] = useState('');
    const ref = useRef();

    useLayoutEffect(() => {
        setValidationMessage(ref.current.validationMessage);
    }, [value]);

    return (
        <React.Fragment>
            <input ref={ref} onChange={onChange} value={value} {...inputProps} />
            <div className="invalid-message">{validationMessage}</div>
        </React.Fragment>
    );
}

export default function FormInput({label, longLabel, inputProps, suggestions}) {
    const {onChange: otherOnChange, ...otherProps} = inputProps;
    const [value, setValue] = useState('');
    const [matches, exactMatch] = useMatches(value.toLowerCase(), suggestions);
    const [accepted, setAccepted] = useState(false);

    function accept(item) {
        setValue(item);
        setAccepted(true);
        otherOnChange({target: {value: item}});
    }

    const [activeIndex, handleKeyDown, setActiveIndex] = useSelectList({
        getItems: () => matches,
        accept,
        searchable: false
    });

    function onChange(event) {
        if (otherOnChange) {
            otherOnChange(event);
        }
        setValue(event.target.value);
        setAccepted(false);
    }
    function onKeyDown(event) {
        if (handleKeyDown(event)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    return (
        <label className="form-input">
            <div className="control-group">
                {label && <label className="field-label">{label}</label>}
                {longLabel && <label className="field-long-label">{longLabel}</label>}
                <ValidatingInput value={value} inputProps={{onKeyDown, ...otherProps}} onChange={onChange} />
                {
                    suggestions &&
                        <SuggestionBox
                            matches={matches} exactMatch={exactMatch}
                            accepted={accepted}
                            accept={accept} activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
                        />
                }
            </div>
        </label>
    );
}
