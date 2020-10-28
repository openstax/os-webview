import React from 'react';
import FormSelect from '~/components/form-select/form-select.jsx';
import './filters.css';

function InstitutionSelector({setInstitution}) {
    const options = [
        {label: 'Any', value: '', selected: true},
        {label: 'College/University', value: 'College/University'},
        {label: 'Technical/Community College', value: 'Technical/Community College'},
        {label: 'High School', value: 'High School'}
    ];

    function onChange(event) {
        console.info('Set institution', event.target.value);
        setInstitution(event.target.value);
    }

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
    function onChange(event) {
        const {checked} = event.target;

        if (checked) {
            selected.add(name);
        } else {
            selected.delete(name);
        }
    }

    return (
        <label class="for-checkbox">
            <input type="checkbox" name={name} onChange={onChange} />
            {label}
        </label>
    );
}

export default function Filters({selected, setInstitution}) {
    return (
        <div className="filters">
            <div class="institution-region">
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
