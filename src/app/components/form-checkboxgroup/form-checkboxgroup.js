import React from 'react';

function Option({item, name, onChange, checked=false}) {
    const inputProps = item.value ? {
        name,
        value: item.value
    } : {};

    return (
        <div className="checkbox-control-group">
            <label>
                <input type="checkbox" {...inputProps} checked={checked} onChange={onChange} />
                {item.label}
            </label>
        </div>
    );
}

export default function FormCheckboxgroup(
    {name, label, longLabel, instructions, options, onChange}
) {
    const checkedItems = React.useMemo(() => new window.Set(), []);

    function onItemChange({target: {value, checked}}) {
        const method = checked ? 'add' : 'delete';

        checkedItems[method](value);
        if (onChange) {
            onChange(Array.from(checkedItems.values()));
        }
    }

    return (
        <div className="form-checkboxgroup">
            {label && <label className="field-label">{label}</label>}
            {longLabel && <label className="field-long-label">{longLabel}</label>}
            {instructions && <label className="hint">{instructions}</label>}
            {
                options.map((item) =>
                    <Option
                        item={item} name={name} key={item}
                        checked={checkedItems.has(item.value)}
                        onChange={onItemChange}
                    />
                )
            }
        </div>
    );
}
