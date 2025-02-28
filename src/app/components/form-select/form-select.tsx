import React from 'react';
import DropdownSelect from '~/components/select/drop-down/drop-down';

export default function FormSelect({
    label, name, selectAttributes, options=[], onValueUpdate
}: {
    label: string;
    name: string;
    selectAttributes: object;
    options: unknown[];
    onValueUpdate?: unknown;
}) {
    return (
        <div className="control-group">
            {label && <label className="field-label">{label}</label>}
            <DropdownSelect
                name={name} {...selectAttributes}
                options={options} onValueUpdate={onValueUpdate}
            />
        </div>
    );
}
