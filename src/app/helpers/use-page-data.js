import React from 'react';
import {fetchFromCMS} from '~/helpers/page-data-utils';
import $ from '~/helpers/$';

export default function usePageData(slug, preserveWrapping=false) {
    const [data, setData] = React.useState();

    React.useEffect(() => {
        fetchFromCMS(slug, preserveWrapping).then($.camelCaseKeys).then(setData);
    }, [slug, preserveWrapping]);

    return data;
}
