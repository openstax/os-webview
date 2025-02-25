import React from 'react';

type Item = {
    label: string;
    value: string;
}

function Option({item, name, onChange, checked}: {
    item: Item;
    name: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    checked: boolean;
}) {
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
    {name, label, longLabel, instructions, options, onChange}: {
        name: string;
        label?: string;
        longLabel?: string;
        instructions?: string;
        options: Item[];
        onChange?: (arr: unknown[]) => void;
    }
) {
    const checkedItems = React.useMemo(() => new window.Set(), []);
    const onItemChange = React.useCallback(
        ({target: {value, checked}}: React.ChangeEvent<HTMLInputElement>) => {
            const method = checked ? 'add' : 'delete';

            checkedItems[method](value);
            onChange?.(Array.from(checkedItems.values()));
        },
        [checkedItems, onChange]
    );

    return (
        <div className="form-checkboxgroup">
            {label && <label className="field-label">{label}</label>}
            {longLabel && <label className="field-long-label">{longLabel}</label>}
            {instructions && <label className="hint">{instructions}</label>}
            {
                options.map((item) =>
                    <Option
                        item={item} name={name} key={item.value}
                        checked={checkedItems.has(item.value)}
                        onChange={onItemChange}
                    />
                )
            }
        </div>
    );
}
