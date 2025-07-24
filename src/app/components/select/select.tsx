import React from 'react';
import useSelectContext, {SelectContextProvider} from './select-context';
import ValidationMessage from '~/components/validation-message/validation-message';

function HiddenSelect({
    name,
    required,
    elementRef
}: {
    name: string;
    required?: boolean;
    elementRef: React.MutableRefObject<HTMLSelectElement | null>;
}) {
    const {item} = useSelectContext();

    return (
        <select name={name} required={required} ref={elementRef} hidden>
            {item && <option value={item.value} selected />}
        </select>
    );
}

function SValidationMessage({
    elementRef
}: {
    elementRef: React.MutableRefObject<HTMLSelectElement | null>;
}) {
    const {item} = useSelectContext();

    if (elementRef.current === null) {
        return null;
    }

    return (
        <ValidationMessage
            watchValue={item}
            elementRef={elementRef as React.MutableRefObject<HTMLSelectElement>}
        />
    );
}

export default function Select({
    name,
    required,
    onValueUpdate,
    children
}: React.PropsWithChildren<{
    name: string;
    required?: boolean;
    onValueUpdate?: (v: string) => void;
}>) {
    const elementRef = React.useRef<HTMLSelectElement>(null);

    return (
        <SelectContextProvider contextValueParameters={{onValueUpdate}}>
            <div className="Select">
                {name && <HiddenSelect {...{name, required, elementRef}} />}
                {children}
            </div>
            <SValidationMessage elementRef={elementRef} />
        </SelectContextProvider>
    );
}
