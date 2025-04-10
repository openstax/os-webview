import React from 'react';
import DropdownSelect from '~/components/select/drop-down/drop-down';
import {SelectItem} from '../select/select-context';

export default function FormSelect({
    label,
    name,
    selectAttributes,
    options = [],
    onValueUpdate
}: {
    label: string;
    name: string;
    selectAttributes: object;
    options: SelectItem[];
    onValueUpdate?: (v: string) => void;
}) {
    return (
        <div className="control-group">
            {label && <label className="field-label">{label}</label>}
            <DropdownSelect
                name={name}
                {...selectAttributes}
                options={options}
                onValueUpdate={onValueUpdate}
            />
        </div>
    );
}
