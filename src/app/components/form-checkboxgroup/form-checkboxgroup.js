import React from 'react';

function Option({item, name}) {
    const inputProps = item.value ? {
        name,
        value: item.value
    } : {};

    return (
        <div class="checkbox-control-group">
            <label>
                <input type="checkbox" {...inputProps} />
                {item.label}
            </label>
        </div>
    );
}

export default function FormCheckboxgroup({name, label, longLabel, instructions, options}) {
    return (
        <div className="form-checkboxgroup">
            {label && <label className="field-label">{label}</label>}
            {longLabel && <label className="field-long-label">{longLabel}</label>}
            {instructions && <label class="hint">{instructions}</label>}
            {
                options.map((item) =>
                    <Option item={item} name={name} key={item} />
                )
            }
        </div>
    );
}
