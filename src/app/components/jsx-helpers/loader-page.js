import React from 'react';
import {camelCaseKeys} from '~/helpers/page-data-utils';
import usePageData from '~/helpers/use-page-data';
import {setPageTitleAndDescriptionFromBookData, useCanonicalLink} from '~/helpers/use-document-head';
import Error404 from '~/pages/404/404';

function LoadedPage({
    Child, data, props, doDocumentSetup, noCamelCase
}) {
    const camelCaseData = React.useMemo(
        () => noCamelCase ? data : camelCaseKeys(data),
        [data, noCamelCase]
    );

    useCanonicalLink(doDocumentSetup);
    React.useEffect(() => {
        if (doDocumentSetup) {
            setPageTitleAndDescriptionFromBookData(data);
        }
    }, [data, doDocumentSetup]);

    if (data.error) {
        return (<Error404 />);
    }

    return (
        <Child {...{data: camelCaseData, ...props}} />
    );
}

export default function LoaderPage({
    slug, Child, props={}, preserveWrapping, doDocumentSetup=false,
    noCamelCase=false
}) {
    const data = usePageData(slug, preserveWrapping, noCamelCase);

    if (!data) {
        return null;
    }

    return (<LoadedPage {...{Child, data, props, doDocumentSetup, noCamelCase}} />);
}
