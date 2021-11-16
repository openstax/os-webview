import React, {useState} from 'react';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select.jsx';
import FormRadioGroup from '~/components/form-radiogroup/form-radiogroup';
import schoolPromise from '~/models/schools';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './contact-info.scss';

function SchoolHiddenInfo({school}) {
    if (!school) {
        return null;
    }

    return (
        <React.Fragment>
            <input type="hidden" name="school_type" value={school.type} />
            <input type="hidden" name="school_location" value={school.location} />
            <input
                type="hidden" name="school_total_enrollment"
                value={school.total_school_enrollment}
            />
        </React.Fragment>
    );
}

function SchoolInfo({schools}) {
    const schoolTypeOptions = React.useMemo(
        () => schools.reduce((a, b) => {
            if (b.type && !a.includes(b.type)) {
                a.unshift(b.type);
            }
            return a;
        }, ['Other']).map((text) => ({label: text, value: text})),
        [schools]
    );
    const [schoolLocation, setSchoolLocation] = useState();

    return (
        <div className="school-info">
            <div className="instructions">
                We don&apos;t have that school in our system. Please tell us a little
                more about it:
            </div>
            <FormSelect
                label="What type of school is it?"
                name="school_type"
                selectAttributes={{required: true}}
                options={schoolTypeOptions}
            />
            <FormRadioGroup
                longLabel="Is it located in the United States?"
                name="school_location"
                options={[
                    {label: 'Yes', value: 'Domestic'},
                    {label: 'No', value: 'Foreign'}
                ]}
                selectedValue={schoolLocation}
                setSelectedValue={setSchoolLocation}
                required
            />
        </div>
    );
}

function SchoolSelector() {
    const schools = useDataFromPromise(schoolPromise, []).sort();
    const schoolNames = schools.map((s) => s.name);
    const schoolSet = new window.Set(schoolNames.map((s) => s.toLowerCase()));
    const [value, setValue] = useState('');
    const schoolIsOk = schoolSet.has(value.toLowerCase());
    const selectedEntry = schoolIsOk && schools.find((s) => s.name.toLowerCase() === value.toLowerCase());

    function onChange({target}) {
        setValue(target.value);
    }

    return (
        <React.Fragment>
            <FormInput
                label="School name"
                suggestions={schoolNames}
                inputProps={{
                    type: 'text',
                    name: 'school',
                    required: true,
                    autocomplete: 'off',
                    value,
                    onChange
                }}
            />
            <SchoolHiddenInfo school={selectedEntry} />
            {!schoolIsOk && value.length > 3 && <SchoolInfo schools={schools} />}
        </React.Fragment>
    );
}

export default function ContactInfo() {
    return (
        <div className="contact-info">
            <FormInput
                label="First name"
                inputProps={{
                    type: 'text',
                    name: 'first_name',
                    required: true,
                    autocomplete: 'given-name',
                    maxlength: 35
                }}
            />
            <FormInput
                label="Last name"
                inputProps={{
                    type: 'text',
                    name: 'last_name',
                    required: true,
                    autocomplete: 'family-name',
                    maxlength: 35

                }}
            />
            <FormInput
                label="Email address"
                inputProps={{
                    type: 'email',
                    name: 'email',
                    required: true,
                    autocomplete: 'email',
                    maxlength: 64
                }}
            />
            <FormInput
                label="Phone number"
                inputProps={{
                    type: 'tel',
                    name: 'phone',
                    required: true,
                    autocomplete: 'tel-national',
                    minlength: 9,
                    maxlength: 20,
                    pattern: '[^a-zA-Z]{9,20}'
                }}
            />
            <SchoolSelector />
        </div>
    );
}
