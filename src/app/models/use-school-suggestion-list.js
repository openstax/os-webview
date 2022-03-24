import React, {useState, useMemo} from 'react';
import sfApiFetch from '~/pages/my-openstax/store/sfapi';
import debounce from 'lodash/debounce';

const debouncedFetch = debounce(
    (value, setSchools) => {
        if (value.length > 1) {
            sfApiFetch('schools', `/search?name=${value}`)
                .then((list) => list.map(
                    (entry) => ({
                        name: entry.name,
                        type: entry.school_type,
                        location: entry.location,
                        total_school_enrollment: entry.total_school_enrollment // eslint-disable-line camelcase
                    })
                ))
                .then(setSchools);
        } else {
            setSchools([]);
        }
    },
    300
);

export default function useMatchingSchools(value) {
    const [schools, setSchools] = useState([]);
    const schoolNames = useMemo(() => schools.map((s) => s.name).sort(), [schools]);
    const schoolSet = useMemo(() => new window.Set(schoolNames.map((s) => s.toLowerCase())), [schoolNames]);
    const schoolIsOk = schoolSet.has(value?.toLowerCase());
    const selectedSchool = schoolIsOk && schools.find((s) => s.name.toLowerCase() === value.toLowerCase());
    const schoolOptions = useMemo(() => schoolNames.map((n) => ({label: n, value: n})), [schoolNames]);

    React.useEffect(
        () => debouncedFetch(value, setSchools),
        [value]
    );

    return {schoolNames, schoolIsOk, selectedSchool, schoolOptions};
}
