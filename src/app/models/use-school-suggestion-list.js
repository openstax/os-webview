import {useState, useMemo} from 'react';
import cmsFetch from './cmsFetch';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';

const schoolPromise = cmsFetch('salesforce/schools/')
    .then((objList) => objList.map((obj) => obj.name));

export default function useSchoolSuggestionList() {
    const schools = useDataFromPromise(schoolPromise, []).sort();
    const [value, setValue] = useState('');
    const lcValue = value.toLowerCase();
    const schoolOptions = useMemo(
        () => schools.filter((s) => {
            const lcS = s.toLowerCase();

            return lcValue.length > 1 ? (
                lcS.startsWith(lcValue) ||
                lcValue.length > 3 && lcS.includes(lcValue)
            ) : false;
        }).map((s) => ({label: s, value: s})),
        [schools, lcValue]
    );
    const schoolSet = useMemo(() => new window.Set(schools), [schools]);
    const schoolIsOk = schoolSet.has(value);

    return {value, setValue, schoolIsOk, schoolOptions};
}
