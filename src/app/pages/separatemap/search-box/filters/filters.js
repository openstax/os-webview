import React from 'react';
import FormSelect from '~/components/form-select/form-select';
import './filters.scss';

function InstitutionSelector({setInstitution}) {
    const options = [
        {label: 'Any', value: '', selected: true},
        {label: 'College/University', value: 'College/University'},
        {label: 'Technical/Community College', value: 'Technical/Community College'},
        {label: 'High School', value: 'High School'}
    ];
    const onChange = React.useCallback(
        (event) => setInstitution(event.target.value),
        [setInstitution]
    );

    return (
        <FormSelect
            name='institution-type'
            selectAttributes={{onChange}}
            label="Type of institution"
            options={options}
        />
    );
}

function ForCheckbox({name, label, selected}) {
    const onChange = React.useCallback(
        (event) => {
            const {checked} = event.target;

            if (checked) {
                selected.add(name);
            } else {
                selected.delete(name);
            }
        },
        [selected, name]
    );

    return (
        <label className="for-checkbox">
            <input type="checkbox" name={name} onChange={onChange} />
            {label}
        </label>
    );
}

export default function Filters({selected, setInstitution}) {
    return (
        <div className="filters">
            <div className="institution-region">
                <InstitutionSelector setInstitution={setInstitution} />
            </div>
            <ForCheckbox
                name="partners" label="OpenStax institutional partners"
                selected={selected}
            />
            <ForCheckbox
                name="savings" label="Schools that have saved over $1 million"
                selected={selected}
            />
            <ForCheckbox
                name="testimonials" label="Have testimonials"
                selected={selected}
            />
        </div>
    );
}
