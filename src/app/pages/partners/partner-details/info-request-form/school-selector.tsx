import React from 'react';
import useMatchingSchools from '~/models/use-school-suggestion-list';
import {FilteringSelect} from '~/components/form-elements/form-elements';

export default function SchoolSelector({value, setValue}: {value: string; setValue: (value: string) => void}) {
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
                    onChange({target}: React.ChangeEvent<HTMLInputElement>) {setValue(target.value);}
                }}
                accept={(option: {value: string}) => setValue(option.value)}
                accepted={schoolIsOk}
            />
        </div>
    );
}

export function useDoSubmit(afterSubmit: () => void) {
    return React.useCallback((form: HTMLFormElement) => {
        form.submit();
        afterSubmit();
    }, [afterSubmit]);
}
