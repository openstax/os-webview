import React from 'react';
import useSelectList from '~/helpers/use-select-list';
import cn from 'classnames';
import './form-elements.scss';

function Option({text, active, onClick}: {
    text: string;
    active: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>
}) {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useLayoutEffect(() => {
        if (active) {
            ref.current?.scrollIntoView({block: 'nearest'});
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

type OptionType = {
    label: string;
    value: string;
}

function SuggestionList({options, activeIndex, accept}: {
    options: OptionType[];
    accept: (o: OptionType) => void;
    activeIndex: number;
}) {
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

export function FilteringSelect({options, inputProps, accept, accepted}: {
    options: OptionType[];
    inputProps: JSX.IntrinsicAttributes;
    accept: (o: unknown) => void;
    accepted?: boolean;
}) {
    const [activeIndex, handleKeyDown, setActiveIndex] = useSelectList({
        getItems() {
            return options;
        },
        accept
    });
    const wrappedKeyDown = React.useCallback(
        // Leave space alone
        (event: React.KeyboardEvent) => {
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
