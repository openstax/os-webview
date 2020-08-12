import React, {useState, useLayoutEffect} from 'react';

function Option({item, name, required, selectedValue, setSelectedValue}) {
    function onChange({target: {value}}) {
        setSelectedValue(value);
    }

    return (
        <div className="radio-control-group">
            <label>
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

export default function FormRadioGroup({label, longLabel, name, options, selectedValue, setSelectedValue, required}) {
    const [validationMessage, setValidationMessage] = useState('');
    const passThruProps = {name, required, selectedValue, setSelectedValue};

    useLayoutEffect(() => {
        const invalid = required && !options.find((opt) => selectedValue === opt.value);

        setValidationMessage(invalid ? 'Please select one' : '');
    }, [selectedValue]);

    return (
        <div className='form-radiogroup'>
            {label && <label className="field-label">{label}</label>}
            {longLabel && <label className="field-long-label">{longLabel}</label>}
            <div>
                {options.map((item) => <Option item={item} {...passThruProps} key={item} />)}
            </div>
            <div className="invalid-message">{validationMessage}</div>
        </div>
    );
}
