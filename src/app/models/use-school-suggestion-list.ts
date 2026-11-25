import React, {useState, useMemo} from 'react';
import * as Sentry from '@sentry/react';
import sfApiFetch from '~/models/sfapi';
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

export type SchoolSuggestion = {
    name: string;
    type: string;
    location: string;
    total_school_enrollment: string;
};

type SFSchool = {
    name: string;
    type: string;
    country: string | null;
    total_school_enrollment?: number | null;
};

type SFSchoolsResponse = {schools?: SFSchool[]};

// Salesforce counts territories as domestic, and sfapi gives us only the country.
function locationOf(country: SFSchool['country']) {
    return country?.startsWith('United States') ? 'Domestic' : 'Foreign';
}

// The form field is a string, empty when sfapi withholds the number or has none.
function enrollmentOf(enrollment: SFSchool['total_school_enrollment']) {
    return typeof enrollment === 'number' ? String(enrollment) : '';
}

// sfApiFetch swallows its failures and returns null, which would hide an outage.
function reportFailure() {
    const failure = new Error('Failed to fetch schools from sfapi');

    Sentry.captureException(failure);
}

// A 404 ("No schools found"), a 429 throttle or any other error body has no schools list.
async function fetchSchools(value: string): Promise<SchoolSuggestion[]> {
    const body: SFSchoolsResponse | null = await sfApiFetch(
        'schools',
        `?name=${encodeURIComponent(value)}`
    );

    if (body === null) {
        reportFailure();
        return [];
    }
    return (body.schools ?? []).map((school) => ({
        name: school.name,
        type: school.type,
        location: locationOf(school.country),
        total_school_enrollment: enrollmentOf(school.total_school_enrollment) // eslint-disable-line camelcase
    }));
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
