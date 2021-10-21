import React from 'react';
import usePartnerContext from '../partner-context';
import useSchoolSuggestionList from '~/models/use-school-suggestion-list';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useUserContext from '~/contexts/user';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import BookTagsMultiselect from '~/components/multiselect/book-tags/book-tags';
import {books} from '../../store';
import FormRadiogroup from '~/components/form-radiogroup/form-radiogroup';
import FormSelect from '~/components/form-select/form-select.jsx';
import {FilteringSelect} from '~/components/form-elements/form-elements';
import inputProps from '~/components/form-elements/input-props';
import FormInput from '~/components/form-input/form-input';
import useFormTarget from '~/components/form-target/form-target';
import {useContextValue as useSalesforceContextValue} from '~/contexts/salesforce';
import './info-request-form.scss';

const countryOptions = [
    {label: 'United States', value: 'Domestic'},
    {label: 'Non-US', value: 'Foreign'}
];

function AdoptedQuestion() {
    const {adoption} = useSalesforceContextValue();
    const [yesObj, noObj] = adoption(['adopted', 'recommended']);
    const adoptionYesNoOptions = [
        {label: 'Yes', value: yesObj.value},
        {label: 'No', value: noObj.value}
    ];

    return (
        <div>
            <p className="instruction">
                Are you currently using an OpenStax book as the primary textbook
                for your course?
            </p>
            <FormRadiogroup
                name="are_you_currently_using_openstax"
                required
                options={adoptionYesNoOptions}
            />
        </div>
    );
}

function PartnerTypeQuestion() {
    const {partnerName, partnerType} = usePartnerContext();

    if (!partnerType) {
        return null;
    }

    const pt = partnerType.toLowerCase();
    const aAn = (/^[aeiou]/).test(pt) ? 'an' : 'a';
    const yesNoOptions = [
        {label: 'Yes', value: partnerType, checked: true},
        {label: 'No', value: ''}
    ];

    return (
        <div>
            <p className="instruction">
                {partnerName}{' '}is {aAn} {pt} product. Would you
                also like to receive information about our other {pt} partners?
            </p>
            <FormRadiogroup
                name="partner_category_interest"
                required
                options={yesNoOptions}
            />
        </div>
    );
}

function Page1() {
    const {partnerName} = usePartnerContext();

    console.info('Books:', books.value);
    return (
        <div className="form-page">
            <input type="hidden" name="partner_product_interest" value={partnerName} />
            <p className="headline">
                Please give us a little more information about your interest in
                {' '}{partnerName}.
            </p>
            <p>
                All fields are required
            </p>
            <div className="form-group">
                <label>Book of interest</label>
                <BookTagsMultiselect
                    name="subjects_of_interest" required
                    selected={books.value} oneField
                />
            </div>
            <PartnerTypeQuestion />
            <AdoptedQuestion />
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
                    name: 'institution_name',
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
    const {userModel, userStatus} = useUserContext();
    const schoolCountries = React.useMemo(() => {
        const schoolLocation = userModel?.accountsModel?.school_location;

        if (schoolLocation) {
            const schoolCountrySelection = countryOptions
                .find((opt) => schoolLocation.startsWith(opt.value.toLowerCase()));

            if (schoolCountrySelection) {
                schoolCountrySelection.selected = true;
                return ([...countryOptions]);
            }
        }
        return countryOptions;
    }, [userModel]);

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
                        name: 'role',
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
                        name: 'number_of_students_you_are_teaching_this_year',
                        required: true,
                        min: '1',
                        max: '999'
                    }}
                />
                <FormInput
                    label="School issued email address"
                    inputProps={{...inputProps.email, value: userStatus.email}}
                />
                <FormInput
                    label="First name"
                    inputProps={{...inputProps.firstName, value: userStatus.firstName}}
                />
                <FormInput
                    label="Last name"
                    inputProps={{...inputProps.lastName, value: userStatus.lastName}}
                />
                <FormInput
                    label="Phone number"
                    inputProps={{...inputProps.phone}}
                />
                <FormSelect
                    selectAttributes={{
                        name: 'country',
                        placeholder: 'Select your country',
                        required: true
                    }}
                    label="Country" options={schoolCountries}
                />
            </div>
        </div>
    );
}

export default function InfoRequestForm() {
    const {toggleForm} = usePartnerContext();
    const roles = useDataFromSlug('snippets/roles');
    const roleOptions = roles?.map((r) => ({label: r.display_name, value: r.salesforce_name}));
    const {onSubmit, submitting, FormTarget} = useFormTarget(toggleForm);
    const {techScoutUrl} = useSalesforceContextValue();

    function doSubmit(form) {
        form.submit();
        onSubmit();
    }

    return (
        <React.Fragment>
            <FormTarget submitting={submitting} />
            <MultiPageForm
                action={techScoutUrl} className="info-request-form"
                onSubmit={doSubmit} submitting={submitting}
                target="form-target"
            >
                <Page1 />
                <Page2 roleOptions={roleOptions} />
            </MultiPageForm>
        </React.Fragment>
    );
}
