import React, {useState} from 'react';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select.jsx';
import FormRadioGroup from '~/components/form-radiogroup/form-radiogroup';
import schoolPromise from '~/models/schools';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './contact-info.scss';

// const message = 'Please enter your full school name without abbreviations.' +
//     ' If this is your full school name, you can click Next.';

const schoolTypeOptions = [
    'Technical/Community College',
    'College or University',
    'High School',
    'Middle School',
    'Elementary School',
    'K-12 institution',
    'Homeschool',
    'Other'
].map((text) => ({label: text, value: text}));

function SchoolSelector() {
    const schools = useDataFromPromise(schoolPromise, []).sort();
    const schoolNames = schools.map((s) => s.name);
    const schoolSet = new window.Set(schoolNames.map((s) => s.toLowerCase()));
    const [value, setValue] = useState('');
    const [schoolLocation, setSchoolLocation] = useState();
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
            {
                selectedEntry &&
                <React.Fragment>
                    <input type="hidden" name="school_type" value={selectedEntry.type} />
                    <input type="hidden" name="school_location" value={selectedEntry.location} />
                    <input
                        type="hidden" name="school_total_enrollment"
                        value={selectedEntry.total_school_enrollment}
                    />
                </React.Fragment>
            }
            {
                !schoolIsOk && value.length > 3 &&
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
            }
        </React.Fragment>
    );
}

export default function ContactInfo({validatorRef}) {
    if (validatorRef) {
        validatorRef.current = () => true;
    }


    return (
        <div className="contact-info">
            <FormInput
                label="First name"
                inputProps={{
                    type: 'text',
                    name: 'first_name',
                    required: true,
                    autocomplete: 'given-name'
                }}
            />
            <FormInput
                label="Last name"
                inputProps={{
                    type: 'text',
                    name: 'last_name',
                    required: true,
                    autocomplete: 'family-name'
                }}
            />
            <FormInput
                label="Email address"
                inputProps={{
                    type: 'email',
                    name: 'email',
                    required: true,
                    autocomplete: 'email'
                }}
            />
            <FormInput
                label="Phone number"
                inputProps={{
                    type: 'text',
                    name: 'phone',
                    required: true,
                    autocomplete: 'tel-national'
                }}
            />
            <SchoolSelector />
        </div>
    );
}
