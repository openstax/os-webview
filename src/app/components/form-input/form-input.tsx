import React, {useState, useRef, useLayoutEffect} from 'react';
import useSelectList from '~/helpers/use-select-list';
import {useMainSticky} from '~/helpers/main-class-hooks';
import cn from 'classnames';
import './form-input.scss';

// Accessibility issues here:
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-autocomplete

const LIMIT_SUGGESTIONS = 400;

function SuggestionItem({
    value,
    accept,
    index,
    activeIndex,
    setActiveIndex
}: {
    value: string;
    accept: (v: string) => void;
    index: number;
    activeIndex: number;
    setActiveIndex: (n: number) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const active = index === activeIndex;

    useLayoutEffect(() => {
        if (active) {
            ref.current?.scrollIntoView({block: 'nearest'});
        }
    }, [active]);

    return (
        <div
            className={cn('suggestion', {active})}
            ref={ref}
            onClick={() => accept(value)}
            onMouseMove={() => setActiveIndex(index)}
        >
            {value}
        </div>
    );
}

function useMatches(pattern: string, suggestions: string[] = []) {
    const matches = React.useMemo(
        () =>
            pattern.length > 1
                ? suggestions.filter((s) => s.toLowerCase().includes(pattern))
                : [],
        [pattern, suggestions]
    );
    const exactMatch = React.useMemo(
        () =>
            matches.includes(pattern) ||
            (matches.length === 1 && pattern === matches[0].toLowerCase()),
        [matches, pattern]
    );

    return [matches, exactMatch] as const;
}

function SuggestionBox({
    matches,
    exactMatch,
    accepted,
    accept,
    activeIndex,
    setActiveIndex
}: {
    matches: string[];
    exactMatch: boolean;
    accepted: boolean;
    accept: (v: string) => void;
    activeIndex: number;
    setActiveIndex: (n: number) => void;
}) {
    if (exactMatch) {
        accept(matches[0]);
    }
    useMainSticky();

    return (
        <div className="suggestions">
            <div className="suggestion-box">
                {!exactMatch &&
                    !accepted &&
                    matches
                        .slice(0, LIMIT_SUGGESTIONS)
                        .map((match, i) => (
                            <SuggestionItem
                                value={match}
                                accept={accept}
                                index={i}
                                activeIndex={activeIndex}
                                setActiveIndex={setActiveIndex}
                                key={match}
                            />
                        ))}
                {matches.length > LIMIT_SUGGESTIONS && (
                    <div className="suggestion">
                        <i>List truncated</i>
                    </div>
                )}
            </div>
        </div>
    );
}

type InputProps = {
    Tag?: keyof JSX.IntrinsicElements;
} & React.InputHTMLAttributes<HTMLInputElement>;

function ValidatingInput({
    value,
    inputProps,
    onChange,
    accepted
}: {
    value: string;
    inputProps: InputProps;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accepted: boolean;
}) {
    const [validationMessage, setValidationMessage] = useState('');
    const ref = useRef<HTMLElement & {validationMessage: string}>(null);
    const Tag = inputProps.Tag || 'input';

    useLayoutEffect(() => {
        const vm = ref.current?.validationMessage as string;

        setValidationMessage(vm);
        if (!vm && !accepted) {
            setValidationMessage('Not a valid selection');
        }
    }, [value, accepted]);

    return (
        <React.Fragment>
            {/* @ts-expect-error too complex */}
            <Tag ref={ref} onChange={onChange} value={value} {...inputProps} />
            <div className="invalid-message">{validationMessage}</div>
        </React.Fragment>
    );
}

// eslint-disable-next-line complexity
export default function FormInput({
    label,
    longLabel,
    inputProps,
    suggestions
}: {
    label?: string;
    longLabel?: string;
    inputProps: InputProps;
    suggestions?: string[];
}) {
    const [value, setValue] = useState(inputProps.value?.toString() ?? '');
    const {onChange: otherOnChange, ...otherProps} = inputProps;
    const [matches, exactMatch] = useMatches(
        value.toString().toLowerCase(),
        suggestions
    );
    const [accepted, setAccepted] = useState(!suggestions?.length);
    const accept = React.useCallback(
        (item: string) => {
            setValue(item);
            setAccepted(true);
            if (otherOnChange) {
                otherOnChange({
                    target: {value: item}
                } as React.ChangeEvent<HTMLInputElement>);
            }
        },
        [otherOnChange]
    );
    const [activeIndex, handleKeyDown, setActiveIndex] = useSelectList({
        getItems: () => matches,
        accept,
        searchable: false
    });
    const onChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (otherOnChange) {
                otherOnChange(event);
            }
            setValue(event.target.value);
            // Fields without suggestions should be considered accepted
            // Empty suggestion lists will still be unaccepted
            setAccepted(!suggestions);
        },
        [otherOnChange, suggestions]
    );
    const onKeyDown = React.useCallback(
        (event: React.KeyboardEvent) => {
            // Don't use space to accept
            if (event.key === ' ') {
                return;
            }
            if (handleKeyDown(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        [handleKeyDown]
    );
    const id = `form-input-${Math.floor(Math.random() * 1010101)}`;

    return (
        <label className="form-input">
            <div className="control-group">
                {label && <label className="field-label" htmlFor={id}>{label}</label>}
                {longLabel && (
                    <label className="field-long-label">{longLabel}</label>
                )}
                <ValidatingInput
                    value={value}
                    inputProps={{onKeyDown, ...otherProps, id}}
                    onChange={onChange}
                    accepted={accepted}
                />
                {suggestions && (
                    <SuggestionBox
                        matches={matches}
                        exactMatch={exactMatch}
                        accepted={accepted}
                        accept={accept}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                    />
                )}
            </div>
        </label>
    );
}
