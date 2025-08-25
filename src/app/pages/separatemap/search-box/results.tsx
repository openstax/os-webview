import {useState, useEffect} from 'react';
import querySchools, {AugmentedInfo} from '~/models/query-schools';
import {useDataFromPromise} from '~/helpers/page-data-utils';
import type {SetHandle} from '~/helpers/data';

type Results = {TOO_MANY: unknown} | AugmentedInfo[];

function useSchoolsPromise(searchString: string, filters: SetHandle, institution: string) {
    const [promise, setPromise] = useState<Promise<Results> | null>(null);

    useEffect(() => {
        const filtersArray = Array.from(filters.values()) as string[];
        const filtersDict = filtersArray.reduce((a, b) => {
            a[b] = b;
            return a;
        }, {} as Record<string, string>);

        filtersDict['institution-type'] = institution;
        const p = querySchools(searchString, filtersDict);

        if (p) {
            setPromise(p);
        }
    }, [searchString, filters, institution]);

    return promise;
}

// eslint-disable-next-line complexity
export default function useResults(searchString: string, selectedFilters: SetHandle, institution: string) {
    const nothingSelected = searchString === '' &&
        Array.from(selectedFilters.values()).length === 0;
    const schoolsPromise = useSchoolsPromise(searchString, selectedFilters, institution);
    const results = useDataFromPromise<Results>(schoolsPromise);
    let message = null;

    if (results && !nothingSelected) {
        if ('TOO_MANY' in results) {
            message = 'Too many matching results';
        } else if (results.length === 0) {
            message = 'No matching results';
        }
    }
    return [results || [], message] as [Results, string];
}
