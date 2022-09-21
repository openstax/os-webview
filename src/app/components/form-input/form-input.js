import React, {useState, useRef, useLayoutEffect} from 'react';
import {useSelectList} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {useMainSticky} from '~/helpers/main-class-hooks';
import cn from 'classnames';
import './form-input.scss';

const LIMIT_SUGGESTIONS = 400;

function SuggestionItem({value, accept, index, activeIndex, setActiveIndex}) {
    const ref = useRef();
    const active = index === activeIndex;

    useLayoutEffect(() => {
        if (active) {
            ref.current.scrollIntoView({block: 'nearest'});
        }
    }, [active]);

    return (
        <div
            className={cn('suggestion', {active})} ref={ref}
            onClick={() => accept(value)}
            onMouseMove={() => setActiveIndex(index)}
        >{value}</div>
    );
}

function useMatches(pattern, suggestions=[]) {
    const matches = React.useMemo(
        () => pattern.length > 1 ?
            suggestions.filter((s) => s.toLowerCase().includes(pattern)) :
            [],
        [pattern, suggestions]
    );
    const exactMatch = React.useMemo(
        () => matches.includes(pattern) ||
            (matches.length === 1 && pattern === matches[0].toLowerCase()),
        [matches, pattern]
    );

    return [matches, exactMatch];
}

function SuggestionBox({matches, exactMatch, accepted, accept, activeIndex, setActiveIndex}) {
    if (exactMatch) {
        accept(matches[0]);
    }
    useMainSticky();

    return (
        <div className="suggestions">
            <div className="suggestion-box">
                {
                    !exactMatch && !accepted && matches.slice(0, LIMIT_SUGGESTIONS).map((match, i) =>
                        <SuggestionItem
                            value={match} accept={accept} index={i}
                            activeIndex={activeIndex} setActiveIndex={setActiveIndex}
                            key={match}
                        />)
                }
                {
                    matches.length > LIMIT_SUGGESTIONS &&
                    <div className="suggestion"><i>List truncated</i></div>
                }
            </div>
        </div>
    );
}

function ValidatingInput({value, inputProps, onChange, accepted}) {
    const [validationMessage, setValidationMessage] = useState('');
    const ref = useRef();
    const Tag = inputProps.Tag || 'input';

    useLayoutEffect(() => {
        setValidationMessage(ref.current.validationMessage);
        if (!ref.current.validationMessage && !accepted) {
            setValidationMessage('Not a valid selection');
        }
    }, [value, accepted]);

    return (
        <React.Fragment>
            <Tag ref={ref} onChange={onChange} value={value} {...inputProps} />
            <div className="invalid-message">{validationMessage}</div>
        </React.Fragment>
    );
}

export default function FormInput({label, longLabel, inputProps, suggestions}) {
    const [value, setValue] = useState('');
    const {onChange: otherOnChange, ...otherProps} = inputProps;
    const [matches, exactMatch] = useMatches(value.toLowerCase(), suggestions);
    const [accepted, setAccepted] = useState(!suggestions?.length);

    function accept(item='') {
        setValue(item);
        setAccepted(true);
        if (otherOnChange) {
            otherOnChange({target: {value: item}});
        }
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
        // Fields without suggestions should be considered accepted
        // Empty suggestion lists will still be unaccepted
        setAccepted(!suggestions);
    }
    function onKeyDown(event) {
        // Don't use space to accept
        if (event.key === ' ') {
            return;
        }
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
                <ValidatingInput
                    value={value} inputProps={{onKeyDown, ...otherProps}}
                    onChange={onChange} accepted={accepted}
                />
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
