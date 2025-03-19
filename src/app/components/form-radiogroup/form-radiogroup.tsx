import React, {useState} from 'react';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';

type OptionItem = {
    value: string;
    label: string;
    checked?: boolean;
}

function Option({item, name, required, selectedValue, onChange}: {
    item: OptionItem;
    name: string;
    required?: boolean;
    selectedValue?: string;
    onChange: React.ChangeEventHandler;
}) {
    return (
        <div className="radio-control-group">
            <label tabIndex={0} onKeyDown={treatSpaceOrEnterAsClick}>
                <input
                    type="radio"
                    name={name}
                    value={item.value}
                    checked={item.value === selectedValue}
                    required={required}
                    onChange={onChange}
                />
                {item.label}
            </label>
        </div>
    );
}

type InputElementWithValidationMessage = HTMLInputElement & {
    validationMessage: string;
}

export default function FormRadioGroup({
    longLabel, name, options, required
}: {
    longLabel?: string;
    name: string;
    options: OptionItem[];
    required?: boolean;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [validationMessage, setValidationMessage] = useState('');
    const checkedValue = options.find((opt) => opt.checked)?.value;
    const [selectedValue, setSelectedValue] = useState(checkedValue);
    const validate = React.useCallback(
        () => {
            const invalid = ref.current?.querySelector<InputElementWithValidationMessage>(':invalid');

            setValidationMessage(invalid ? invalid.validationMessage : '');
        },
        []
    );
    const onChange = React.useCallback(
        ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedValue(value);
            validate();
        },
        [validate]
    );
    const passThruProps = React.useMemo(
        () => ({name, required, selectedValue, onChange}),
        [name, required, selectedValue, onChange]
    );

    React.useEffect(validate, [validate]);

    return (
        <div className='form-radiogroup'>
            {longLabel && <label className="field-long-label">{longLabel}</label>}
            <div ref={ref}>
                {options.map((item) => <Option item={item} {...passThruProps} key={item.value} />)}
            </div>
            <div className="invalid-message">{validationMessage}</div>
        </div>
    );
}
