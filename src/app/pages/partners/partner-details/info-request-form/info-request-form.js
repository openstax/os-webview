import React from 'react';
import usePartnerContext from '../partner-context';
import useSchoolSuggestionList from '~/models/use-school-suggestion-list';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import BookTagsMultiselect from '~/components/multiselect/book-tags/book-tags';
import FormRadiogroup from '~/components/form-radiogroup/form-radiogroup';
import FormSelect from '~/components/form-select/form-select.jsx';
import {FilteringSelect} from '~/components/form-elements/form-elements';
import inputProps from '~/components/form-elements/input-props';
import FormInput from '~/components/form-input/form-input';
import './info-request-form.scss';

const action = 'http://www2.openstax.org/l/218812/2021-10-06/t5tr2x';
const yesNoOptions = [
    {label: 'Yes', value: 'yes'},
    {label: 'No', value: 'no'}
];
const countryOptions = [
    {label: 'United States', value: 'Domestic'},
    {label: 'Elsewhere', value: 'Foreign'}
];

function Page1() {
    const {partnerName} = usePartnerContext();

    return (
        <div className="form-page">
            <p className="headline">
                Please give us a little more information about your interest in
                {' '}{partnerName}.
            </p>
            <p>
                All fields are required
            </p>
            <div className="form-group">
                <label>Book of interest</label>
                <BookTagsMultiselect name="book" required />
            </div>
            <div>
                <p className="instruction">
                    {partnerName}{' '}is an adaptive courseware product. Would you
                    also like to receive information about our other adaptive
                    courseware partners?
                </p>
                <FormRadiogroup
                    name="otherPartners"
                    required
                    options={yesNoOptions}
                />
            </div>
            <div>
                <p className="instruction">
                    Are you currently using an OpenStax book as the primary textbook
                    for your course?
                </p>
                <FormRadiogroup
                    name="primaryText"
                    required
                    options={yesNoOptions}
                />
            </div>
        </div>
    );
}

function SchoolSelector() {
    const {value, setValue, schoolIsOk, schoolOptions} = useSchoolSuggestionList();

    function accept(option) {
        setValue(option.value);
    }

    return (
        <div className="control-group">
            <label className="field-label">School</label>
            <FilteringSelect
                options={schoolOptions}
                inputProps={{
                    placeholder: 'School where you work',
                    required: true,
                    value,
                    onChange({target}) {setValue(target.value);}
                }}
                accept={accept}
                accepted={schoolIsOk}
            />
        </div>
    );
}

function Page2({roleOptions}) {
    return (
        <div className="form-page">
            <p className="headline">
                Almost done! We just need the following information, and then someone
                will be in contact with you shortly.
            </p>
            <p>
                All fields are required
            </p>
            <div className="grid">
                <FormSelect
                    selectAttributes={{
                        placeholder: 'Select your role',
                        required: true
                    }}
                    label="Role" options={roleOptions}
                />
                <SchoolSelector />
                <FormInput
                    label="Number of students you're teaching this year"
                    inputProps={{
                        type: 'number',
                        name: 'num_students',
                        required: true,
                        min: '1',
                        max: '999'
                    }}
                />
                <FormInput
                    label="School issued email address"
                    inputProps={{...inputProps.email}}
                />
                <FormInput
                    label="First name"
                    inputProps={{...inputProps.firstName}}
                />
                <FormInput
                    label="Last name"
                    inputProps={{...inputProps.lastName}}
                />
                <FormInput
                    label="Phone number"
                    inputProps={{...inputProps.phone}}
                />
                <FormSelect
                    selectAttributes={{
                        placeholder: 'Select your country'
                    }}
                    label="Country" options={countryOptions}
                />
            </div>
        </div>
    );
}

export default function InfoRequestForm() {
    const {toggleForm} = usePartnerContext();
    const roles = useDataFromSlug('snippets/roles');
    const roleOptions = roles?.map((r) => ({label: r.display_name, value: r.salesforce_name}));

    return (
        <MultiPageForm action={action} onSubmit={toggleForm} className="info-request-form">
            <Page1 />
            <Page2 roleOptions={roleOptions} />
        </MultiPageForm>
    );
}
