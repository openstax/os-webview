import React from 'react';
import useMultiselectContext, {MultiselectContextProvider} from './multiselect-context';
import ValidationMessage from '~/components/validation-message/validation-message';
import './multiselect.scss';

function HiddenSelect({name, required, elementRef}) {
    const {selectedItems} = useMultiselectContext();

    return (
        <select multi name={name} required={required} ref={elementRef} hidden>
            {
                selectedItems.map((i) =>
                    <option key={i.value} value={i.value} selected />
                )
            }
        </select>
    );
}

function HiddenSingleField({name, required, elementRef}) {
    const {selectedItems} = useMultiselectContext();
    const value = selectedItems.map((i) => i.value).join(';');

    return (
        <input
            type="text" className="hidden-input"
            name={name} required={required} ref={elementRef} value={value}
        />
    );
}

function MSValidationMessage({elementRef}) {
    const {selectedItems} = useMultiselectContext();

    return (
        <ValidationMessage watchValue={selectedItems} elementRef={elementRef} />
    );
}

export default function Multiselect({name, required, children, oneField}) {
    const elementRef = React.useRef();
    const HiddenField = oneField ? HiddenSingleField : HiddenSelect;

    return (
        <MultiselectContextProvider>
            <div className="multiselect">
                {name && <HiddenField {...{name, required, elementRef}} />}
                {children}
            </div>
            <MSValidationMessage elementRef={elementRef} />
        </MultiselectContextProvider>
    );
}
