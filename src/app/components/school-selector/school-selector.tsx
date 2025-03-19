import React from 'react';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import FormRadioGroup from '~/components/form-radiogroup/form-radiogroup';
import useMatchingSchools, {schoolTypeValues} from '~/models/use-school-suggestion-list';
import type {SchoolInfo as School} from '~/models/query-schools';
import {useIntl, FormattedMessage} from 'react-intl';
import './school-selector.scss';

export default function SchoolSelector({initialValue = ''}) {
    const [value, setValue] = React.useState(initialValue);
    const {schoolNames, schoolIsOk, selectedSchool} = useMatchingSchools(value);
    const showSchoolInfo = !schoolIsOk && value.length > 3;
    const onChange = React.useCallback(
        ({target}: React.ChangeEvent<HTMLInputElement>) => setValue(target.value),
        []
    );
    const {formatMessage} = useIntl();

    React.useLayoutEffect(() => {
        if (showSchoolInfo) {
            if (document.hasFocus()) {
                const putFocusBack = document.activeElement as HTMLElement;

                window.setTimeout(() => {
                    putFocusBack.focus();
                }, 40);
            }
        }
    }, [showSchoolInfo]);

    return (
        <div>
            <FormInput
                label={formatMessage({id: 'contact-info.school'})}
                suggestions={schoolNames}
                inputProps={{
                    type: 'text',
                    name: 'school',
                    required: true,
                    autoComplete: 'off',
                    value,
                    onChange
                }}
            />
            {selectedSchool && <SchoolHiddenInfo school={selectedSchool} />}
            {showSchoolInfo && <SchoolInfo />}
        </div>
    );
}

function SchoolInfo() {
    const {formatMessage} = useIntl();
    // Because they have to be statically evaluate-able
    const schoolTypeLabels = {
        'College/University (4)': formatMessage({id: 'school-type.College/University (4)'}),
        'Technical/Community College (2)': formatMessage({id: 'school-type.Technical/Community College (2)'}),
        'Career School/For-Profit (2)': formatMessage({id: 'school-type.Career School/For-Profit (2)'}),
        'High School': formatMessage({id: 'school-type.High School'}),
        'K-12 School': formatMessage({id: 'school-type.K-12 School'}),
        'Home School': formatMessage({id: 'school-type.Home School'}),
        'Other': formatMessage({id: 'school-type.Other'})
    };
    const schoolTypeOptions = schoolTypeValues.map(
        (value) => ({
            label: schoolTypeLabels[value],
            value
        })
    );
    const schoolTypeLabel = formatMessage({id: 'contact-info.school-type-label'});
    const schoolLocationLabel = formatMessage({id: 'contact-info.school-location-label'});

    return (
        <div className="school-info">
            <div className="instructions">
               <FormattedMessage id="contact-info.school-not-found" />
            </div>
            <FormSelect
                label={schoolTypeLabel}
                name="school_type"
                selectAttributes={{required: true}}
                options={schoolTypeOptions}
            />
            <FormRadioGroup
                longLabel={schoolLocationLabel}
                name="school_location"
                options={[
                    {label: formatMessage({id: 'yes'}), value: 'Domestic'},
                    {label: formatMessage({id: 'no'}), value: 'Foreign'}
                ]}
                required
            />
        </div>
    );
}


function SchoolHiddenInfo({school}: {school: Exclude<School, null>}) {
    return (
        <React.Fragment>
            <input type="hidden" name="school_type" value={school.type} />
            <input type="hidden" name="school_location" value={school.location} />
            <input
                type="hidden" name="school_total_enrollment"
                value={school.total_school_enrollment ?? ''}
            />
        </React.Fragment>
    );
}

