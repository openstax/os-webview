import React from 'react';
import useMultiselectContext, {
    MultiselectContextProvider
} from './multiselect-context';
import ValidationMessage, { ElementWithValidationMessage }
    from '~/components/validation-message/validation-message';
import './multiselect.scss';

type ValidatableElementRef = React.MutableRefObject<ElementWithValidationMessage & HTMLInputElement>;
type SelectRef = React.MutableRefObject<HTMLSelectElement>;

function HiddenSelect({
    name,
    required,
    elementRef
}: {
    name: string;
    required?: boolean;
    elementRef: SelectRef;
}) {
    const {selectedItems} = useMultiselectContext();

    return (
        <select
            multiple
            name={name}
            required={required}
            ref={elementRef}
            hidden
        >
            {selectedItems.map((i) => (
                <option key={i.value} value={i.value} selected />
            ))}
        </select>
    );
}

function HiddenSingleField({
    name,
    required,
    elementRef
}: {
    name: string;
    required?: boolean;
    elementRef: ValidatableElementRef;
}) {
    const {selectedItems} = useMultiselectContext();
    const value = selectedItems.map((i) => i.value).join(';');

    return (
        <input
            type="text"
            className="hidden-input"
            name={name}
            required={required}
            ref={elementRef}
            value={value}
        />
    );
}

function MSValidationMessage({elementRef}: {elementRef: ValidatableElementRef}) {
    const {selectedItems} = useMultiselectContext();

    return (
        <ValidationMessage watchValue={selectedItems} elementRef={elementRef} />
    );
}

function useOnChangeHandler(onChange?: (items: unknown[]) => void) {
    const {selectedItems} = useMultiselectContext();

    React.useEffect(() => {
        if (onChange) {
            onChange(selectedItems);
        }
    }, [selectedItems, onChange]);
}

// Multiselect instances must be wrapped in a context provider
// Exporting here for convenience
export {MultiselectContextProvider, useMultiselectContext};

function HiddenField({oneField, name, required, elementRef}: {
    oneField?: boolean;
    name: string;
    required?: boolean;
    elementRef: React.MutableRefObject<HTMLElement | null>
}) {
    return oneField ?
        <HiddenSingleField {...{name, required}} elementRef={elementRef as ValidatableElementRef} /> :
        <HiddenSelect name={name} required={required} elementRef={elementRef as SelectRef} />;
}

export default function Multiselect({
    name,
    required,
    children,
    oneField,
    onChange
}: React.PropsWithChildren<{
    name?: string;
    required?: boolean;
    oneField?: boolean;
    onChange?: Parameters<typeof useOnChangeHandler>[0];
}>) {
    const elementRef = React.useRef<ElementWithValidationMessage | HTMLSelectElement>(null);

    useOnChangeHandler(onChange);
    return (
        <React.Fragment>
            <div className="multiselect">
                {name && <HiddenField {...{oneField, name, required, elementRef}} />}
                {children}
            </div>
            <MSValidationMessage elementRef={elementRef as ValidatableElementRef} />
        </React.Fragment>
    );
}
