import React, {ChangeEvent} from 'react';
import FormSelect from '~/components/form-select/form-select';
import type {SetHandle} from '~/helpers/data';
import './filters.scss';

const options = [
    {label: 'Any', value: '', selected: true},
    {label: 'College/University', value: 'College/University'},
    {
        label: 'Technical/Community College',
        value: 'Technical/Community College'
    },
    {label: 'High School', value: 'High School'}
];

function InstitutionSelector({
    setInstitution
}: {
    setInstitution: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <FormSelect
            name="institution-type"
            label="Type of institution"
            options={options}
            onValueUpdate={setInstitution}
        />
    );
}

function ForCheckbox({
    name,
    label,
    selected
}: {
    name: string;
    label: string;
    selected: SetHandle;
}) {
    const onChange = React.useCallback(
        (event: ChangeEvent) => {
            const {checked} = event.target as HTMLInputElement;

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

export default function Filters({
    selected,
    setInstitution
}: {
    selected: SetHandle;
    setInstitution: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <div className="filters">
            <div className="institution-region">
                <InstitutionSelector setInstitution={setInstitution} />
            </div>
            <ForCheckbox
                name="partners"
                label="OpenStax institutional partners"
                selected={selected}
            />
            <ForCheckbox
                name="savings"
                label="Schools that have saved over $1 million"
                selected={selected}
            />
            <ForCheckbox
                name="testimonials"
                label="Have testimonials"
                selected={selected}
            />
        </div>
    );
}
