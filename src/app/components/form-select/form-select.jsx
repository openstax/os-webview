import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Select from '~/components/select/select.jsx';

export default function FormSelect({
    label, labelHtml, instructions, selectAttributes, placeholder, options=[]
}) {
    return (
        <div className="control-group">
            {label && <label className="field-label">{label}</label>}
            {labelHtml && <RawHTML Tag="label" className="field-label" html={labelHtml} />}
            {instructions && <label className="field-label">{' '}{instructions}</label>}
            <div className="proxy-select" tabindex="0">
                <Select name={name} {...selectAttributes}>
                    {
                        options.map((opt) =>
                            <option value={opt.value} selected={opt.selected} key={opt.value}>
                                {opt.label}
                            </option>
                        )
                    }
                </Select>
            </div>
        </div>
    );
}
