import {useMemo} from 'react';
import cmsFetch from './cmsFetch';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';

const schoolPromise = cmsFetch('salesforce/schools/');

export function useCountryFromSchool(schoolName) {
    const schools = useDataFromPromise(schoolPromise, []);
    const entry = useMemo(() => schools.find((obj) => obj.name === schoolName), [schoolName, schools]);

    return entry?.physical_country;
}

function useFilteredOptions(names, value='') {
    const lcValue = value.toLowerCase();

    return useMemo(
        () => names.filter((name) => {
            const lcS = name?.toLowerCase() || '';

            return lcValue.length > 1 ? (
                lcS.startsWith(lcValue) ||
                lcValue.length > 3 && lcS.includes(lcValue)
            ) : false;
        }).map((name) => ({label: name, value: name})),
        [names, lcValue]
    );
}

export function useCountrySuggestionList(value='') {
    const schools = useDataFromPromise(schoolPromise, []);
    const countries = useMemo(
        () => Array.from(
            new window.Set(schools.map((s) => s.physical_country))
        ).sort(),
        [schools]
    );
    const countryOptions = useFilteredOptions(countries, value);
    const isOk = countries.includes(value);

    return {countryOptions, isOk};
}

export default function useSchoolSuggestionList(value='') {
    const schools = useDataFromPromise(schoolPromise, []);
    const schoolNames = useMemo(() => schools.map((obj) => obj.name).sort(), [schools]);
    const schoolOptions = useFilteredOptions(schoolNames, value);
    const schoolSet = useMemo(() => new window.Set(schoolNames), [schoolNames]);
    const schoolIsOk = schoolSet.has(value);

    return {schoolIsOk, schoolOptions};
}
