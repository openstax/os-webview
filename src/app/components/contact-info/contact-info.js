import React from 'react';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import FormRadioGroup from '~/components/form-radiogroup/form-radiogroup';
import useMatchingSchools from '~/models/use-school-suggestion-list';
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

const schoolTypeOptions = [
    'College/University (4)',
    'Technical/Community College (2)',
    'Career School/For-Profit (2)',
    'High School',
    'K-12 School',
    'Home School',
    'Other'
].map((name) => ({label: name, value: name}));

function SchoolInfo() {
    const [schoolLocation, setSchoolLocation] = React.useState();

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
    const [value, setValue] = React.useState('');
    const {schoolNames, schoolIsOk, selectedSchool} = useMatchingSchools(value);
    const showSchoolInfo = !schoolIsOk && value.length > 3;
    const onChange = React.useCallback(
        ({target}) => setValue(target.value),
        []
    );

    React.useLayoutEffect(() => {
        if (showSchoolInfo) {
            const putFocusBack = document.activeElement;

            window.setTimeout(() => {
                putFocusBack.focus();
            }, 40);
        }
    }, [showSchoolInfo]);

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
            <SchoolHiddenInfo school={selectedSchool} />
            {showSchoolInfo && <SchoolInfo />}
        </React.Fragment>
    );
}

export default function ContactInfo({children}) {
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
            {children}
        </div>
    );
}
