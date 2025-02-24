import React, {useState} from 'react';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';

function Option({item, name, required, selectedValue, onChange}) {
    return (
        <div className="radio-control-group">
            <label tabIndex="0" onKeyDown={treatSpaceOrEnterAsClick}>
                <input
                    type="radio"
                    name={name}
                    value={item.value}
                    checked={item.value === selectedValue}
                    required={required}
                    onChange={onChange}
                />
                {item.label || item.text}
            </label>
        </div>
    );
}

export default function FormRadioGroup({
    label=undefined, longLabel, name, options, required
}) {
    const ref = React.useRef();
    const [validationMessage, setValidationMessage] = useState('');
    const checkedValue = options.find((opt) => opt.checked)?.value;
    const [selectedValue, setSelectedValue] = useState(checkedValue);
    const validate = React.useCallback(
        () => {
            const invalid = ref.current.querySelector(':invalid');

            setValidationMessage(invalid ? invalid.validationMessage : '');
        },
        []
    );
    const onChange = React.useCallback(
        ({target: {value}}) => {
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
            {label && <label className="field-label">{label}</label>}
            {longLabel && <label className="field-long-label">{longLabel}</label>}
            <div ref={ref}>
                {options.map((item) => <Option item={item} {...passThruProps} key={item} />)}
            </div>
            <div className="invalid-message">{validationMessage}</div>
        </div>
    );
}
