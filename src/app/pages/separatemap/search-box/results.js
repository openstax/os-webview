import React, {useState, useEffect} from 'react';
import querySchools from '~/models/querySchools';
import analytics from '~/helpers/analytics';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';

function useSchoolsPromise(searchString, filters, institution) {
    const [promise, setPromise] = useState();

    useEffect(() => {
        const filtersArray = Array.from(filters.values());
        const filtersDict = filtersArray.reduce((a, b) => {
            a[b] = b;
            return a;
        }, {});

        filtersDict['institution-type'] = institution;
        const p = querySchools(searchString, filtersDict);

        if (p) {
            setPromise(p);
            analytics.sendPageEvent('map', 'search', searchString);
            analytics.sendPageEvent('map', 'filters', filtersArray);
        }
    }, [searchString, filters, institution]);

    return promise;
}

// eslint-disable-next-line complexity
export default function useResults(searchString, selectedFilters, institution) {
    const nothingSelected = searchString === '' && institution === '' &&
        Array.from(selectedFilters.values()).length === 0;
    const schoolsPromise = useSchoolsPromise(searchString, selectedFilters, institution);
    const results = useDataFromPromise(schoolsPromise);
    let message = null;

    if (results && !nothingSelected) {
        if (results.TOO_MANY) {
            message = 'Too many matching results';
        } else if (results.length === 0) {
            message = 'No matching results';
        }
    }
    return [results, message];
}
