import React from 'react';
import useMultiselectContext, {MultiselectContextProvider} from './multiselect-context';
import ValidationMessage from '~/components/validation-message/validation-message';

// All native selects are hidden in osweb
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

function MSValidationMessage({elementRef}) {
    const {selectedItems} = useMultiselectContext();

    return (
        <ValidationMessage watchValue={selectedItems} elementRef={elementRef} />
    );
}

export default function Multiselect({name, required, children}) {
    const elementRef = React.useRef();

    return (
        <MultiselectContextProvider>
            <div className="multiselect">
                {name && <HiddenSelect {...{name, required, elementRef}} />}
                {children}
            </div>
            <MSValidationMessage elementRef={elementRef} />
        </MultiselectContextProvider>
    );
}
