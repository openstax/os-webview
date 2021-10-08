import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import DropdownSelect from '~/components/select/drop-down/drop-down';

export default function FormSelect({
    label, name, selectAttributes, options=[]
}) {
    return (
        <div className="control-group">
            {label && <label className="field-label">{label}</label>}
            <DropdownSelect
                name={name} {...selectAttributes}
                options={options}
            />
        </div>
    );
}
