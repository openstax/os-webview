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
                    onChange: useSetValueFromTarget(setValue)
                }}
                accept={useAcceptValue(setValue)}
                accepted={schoolIsOk}
            />
        </div>
    );
}

export function useAcceptValue(setValue: (value: string) => void) {
    return React.useCallback(({value}: {value: string}) => setValue(value), [setValue]);
}

export function useSetValueFromTarget(setValue: (value: string) => void) {
    return React.useCallback(({target}: React.ChangeEvent<HTMLInputElement>) => setValue(target.value), [setValue]);
}

export function useDoSubmit(afterSubmit: () => void) {
    return React.useCallback((form: HTMLFormElement) => {
        form.submit();
        afterSubmit();
    }, [afterSubmit]);
}
