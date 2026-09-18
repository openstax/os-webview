import React, {useState, useMemo} from 'react';
import debounce from 'lodash/debounce';

export const schoolTypeValues = [
    'College/University (4)',
    'Technical/Community College (2)',
    'Career School/For-Profit (2)',
    'High School',
    'K-12 School',
    'Home School',
    'Other'
] as const;

// sfapi rejects a shorter query with a 422
const MINIMUM_QUERY_LENGTH = 3;

const server = 'https://salesforce.openstax.org';

export type SchoolSuggestion = {
    name: string;
    type: string;
    location: string;
    total_school_enrollment: string | null;
};

type SFSchool = {
    name: string;
    type: string;
    country: string | null;
};

// Salesforce counts territories as domestic, and sfapi gives us only the country.
function locationOf(country: SFSchool['country']) {
    return country?.startsWith('United States') ? 'Domestic' : 'Foreign';
}

async function fetchSchools(value: string): Promise<SchoolSuggestion[]> {
    try {
        const response = await fetch(
            `${server}/api/v1/schools?name=${encodeURIComponent(value)}`,
            {mode: 'cors'}
        );

        // 404 is how sfapi reports no matches
        if (!response.ok) {
            return [];
        }
        const {schools} = (await response.json()) as {schools: SFSchool[]};

        return schools.map((school) => ({
            name: school.name,
            type: school.type,
            location: locationOf(school.country),
            // not in the public schools response
            total_school_enrollment: null // eslint-disable-line camelcase
        }));
    } catch {
        return [];
    }
}

const debouncedFetch = debounce((value, setSchools) => {
    if (value?.length >= MINIMUM_QUERY_LENGTH) {
        fetchSchools(value).then(setSchools);
    } else {
        setSchools([]);
    }
}, 300);

export default function useMatchingSchools(value: string) {
    const [schools, setSchools] = useState<SchoolSuggestion[]>([]);
    const schoolNames = useMemo(
        () => schools.map((s) => s.name).sort(),
        [schools]
    );
    const schoolSet = useMemo(
        () => new window.Set(schoolNames.map((s) => s.toLowerCase())),
        [schoolNames]
    );
    const schoolIsOk = schoolSet.has(value.toLowerCase());
    const selectedSchool =
        schoolIsOk &&
        schools.find((s) => s.name.toLowerCase() === value.toLowerCase());
    const schoolOptions = useMemo(
        () => schoolNames.map((n) => ({label: n, value: n})),
        [schoolNames]
    );

    React.useEffect(
        () => debouncedFetch(value, setSchools),
        [value]
    );

    return {schoolNames, schoolIsOk, selectedSchool, schoolOptions};
}
