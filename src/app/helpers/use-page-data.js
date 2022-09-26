import React from 'react';
import {fetchFromCMS} from '~/helpers/page-data-utils';
import $ from '~/helpers/$';

export default function usePageData(slug, preserveWrapping=false, noCamelCase=false) {
    const [data, setData] = React.useState();

    React.useEffect(() => {
        const camelCaseOrNot = noCamelCase ? (obj) => obj : $.camelCaseKeys;

        fetchFromCMS(slug, preserveWrapping)
            .then(camelCaseOrNot)
            .then(setData);
    }, [slug, preserveWrapping, noCamelCase]);

    return data;
}
