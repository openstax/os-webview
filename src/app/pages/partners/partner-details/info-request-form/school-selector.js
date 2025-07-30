import React from 'react';
import useMatchingSchools from '~/models/use-school-suggestion-list';
import {FilteringSelect} from '~/components/form-elements/form-elements';

// Left as JS because I couldn't get the tests to cover these
export default function SchoolSelector({value, setValue}) {
    const {schoolIsOk, schoolOptions} = useMatchingSchools(value);

    return (
        <div className="control-group">
            <label className="field-label" htmlFor="school-name">School</label>
            <FilteringSelect
                options={schoolOptions}
                inputProps={{
                    id: 'school-name',
                    name: 'institution_name',
                    placeholder: 'School where you work',
                    required: true,
                    value,
                    autoComplete: 'off',
                    onChange({target}) {setValue(target.value);}
                }}
                accept={(option) => setValue(option.value)}
                accepted={schoolIsOk}
            />
        </div>
    );
}

export function useDoSubmit(afterSubmit) {
    return React.useCallback((form) => {
        form.submit();
        afterSubmit();
    }, [afterSubmit]);
}
