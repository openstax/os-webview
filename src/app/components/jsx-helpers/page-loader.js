import React from 'react';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import $ from '~/helpers/$';

export default function usePageData(slug, preserveWrapping=false) {
    const [data, setData] = React.useState();

    React.useEffect(() => {
        fetchFromCMS(slug, preserveWrapping).then($.camelCaseKeys).then(setData);
    }, [slug, preserveWrapping]);

    return data;
}
