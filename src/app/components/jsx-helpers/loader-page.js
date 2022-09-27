import React from 'react';
import {camelCaseKeys} from '~/helpers/page-data-utils';
import usePageData from '~/helpers/use-page-data';
import useRouterContext from '~/components/shell/router-context';
import {setPageTitleAndDescriptionFromBookData, useCanonicalLink} from '~/helpers/use-document-head';

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

    return (
        <Child {...{data: camelCaseData, ...props}} />
    );
}

export default function LoaderPage({
    slug, Child, props={}, preserveWrapping, doDocumentSetup=false,
    noCamelCase=false
}) {
    const data = usePageData(slug, preserveWrapping, noCamelCase);
    const {fail} = useRouterContext();

    if (!data) {
        return null;
    }
    if (data.error && fail) {
        fail(`Could not load ${slug}`);
    }

    return (<LoadedPage {...{Child, data, props, doDocumentSetup, noCamelCase}} />);
}
