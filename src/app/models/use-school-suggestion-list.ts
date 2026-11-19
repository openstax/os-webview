import React, {useState, useMemo} from 'react';
import cmsFetch from '~/helpers/cms-fetch';
import debounce from 'lodash/debounce';
import type {SchoolInfo} from './query-schools';

export const schoolTypeValues = [
    'College/University (4)',
    'Technical/Community College (2)',
    'Career School/For-Profit (2)',
    'High School',
    'K-12 School',
    'Home School',
    'Other'
] as const;

type SchoolFetchFunction = (value: string) => Promise<SchoolInfo[] | null>;

const debouncedFetch = debounce(
    (schoolFetch: SchoolFetchFunction, value, setSchools) => {
        if (value?.length > 1) {
            schoolFetch(value)
                .then((list) =>
                    list?.map((entry) => ({
                        name: entry.name,
                        type: entry.type,
                        location: entry.location,
                        total_school_enrollment: entry.total_school_enrollment // eslint-disable-line camelcase
                    }))
                )
                .then(setSchools);
        } else {
            setSchools([]);
        }
    },
    300
);

const schoolFetch: SchoolFetchFunction = (value) =>
    cmsFetch(`salesforce/schools?search=${value}`);

export default function useMatchingSchools(value: string) {
    const [schools, setSchools] = useState<SchoolInfo[] | undefined>([]);
    const schoolNames = useMemo(
        () => schools?.map((s) => s.name).sort() ?? [],
        [schools]
    );
    const schoolSet = useMemo(
        () => new window.Set(schoolNames.map((s) => s.toLowerCase())),
        [schoolNames]
    );
    const schoolIsOk = schoolSet.has(value.toLowerCase());
    const selectedSchool =
        schoolIsOk &&
        schools?.find((s) => s.name.toLowerCase() === value.toLowerCase());
    const schoolOptions = useMemo(
        () => schoolNames.map((n) => ({label: n, value: n})),
        [schoolNames]
    );

    React.useEffect(
        () => debouncedFetch(schoolFetch, value, setSchools),
        [value]
    );

    return {schoolNames, schoolIsOk, selectedSchool, schoolOptions};
}
