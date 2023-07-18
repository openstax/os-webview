import React, {useState, useMemo} from 'react';
import useFlagContext from '~/components/shell/flag-context';
import sfApiFetch from '~/models/sfapi';
import cmsFetch from '~/helpers/cms-fetch';
import debounce from 'lodash/debounce';

const debouncedFetch = debounce(
    (schoolFetch, value, setSchools) => {
        if (value?.length > 1) {
            schoolFetch(value).then((list) => (list || []).map(
                (entry) => ({
                    name: entry.name,
                    type: entry.school_type || entry.type, // different names in sfapi and old cms?
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

function useSchoolFetchFunction() {
    const {my_openstax: isEnabled} = useFlagContext();
    const fn = useMemo(
        () => isEnabled ?
            (value) => sfApiFetch('schools', `/search?name=${value}`) :
            (value) => cmsFetch(`salesforce/schools?search=${value}`)
        ,
        [isEnabled]
    );

    return fn;
}

export default function useMatchingSchools(value) {
    const schoolFetch = useSchoolFetchFunction();
    const [schools, setSchools] = useState([]);
    const schoolNames = useMemo(() => schools.map((s) => s.name).sort(), [schools]);
    const schoolSet = useMemo(() => new window.Set(schoolNames.map((s) => s.toLowerCase())), [schoolNames]);
    const schoolIsOk = schoolSet.has(value?.toLowerCase());
    const selectedSchool = schoolIsOk && schools.find((s) => s.name.toLowerCase() === value.toLowerCase());
    const schoolOptions = useMemo(() => schoolNames.map((n) => ({label: n, value: n})), [schoolNames]);

    React.useEffect(
        () => debouncedFetch(schoolFetch, value, setSchools),
        [value, schoolFetch]
    );

    return {schoolNames, schoolIsOk, selectedSchool, schoolOptions};
}
