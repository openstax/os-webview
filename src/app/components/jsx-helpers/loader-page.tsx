import React from 'react';
import {camelCaseKeys} from '~/helpers/page-data-utils';
import usePageData from '~/helpers/use-page-data';
import {setPageTitleAndDescriptionFromBookData, useCanonicalLink, BookData} from '~/helpers/use-document-head';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import Error404 from '~/pages/404/404';

type RawPageData = {
    error?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChildType = (p: any) => React.JSX.Element;

export function LoadedPage({
    Child, data, props, doDocumentSetup, noCamelCase
} : {
    Child: ChildType;
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    props: object;
    doDocumentSetup?: boolean;
    noCamelCase?: boolean;
}) {
    const camelCaseData = React.useMemo(
        () => noCamelCase ? data : camelCaseKeys(data),
        [data, noCamelCase]
    );

    useCanonicalLink(doDocumentSetup);
    React.useEffect(() => {
        if (doDocumentSetup) {
            setPageTitleAndDescriptionFromBookData(data as BookData);
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
    slug, Child, props={}, preserveWrapping=false, doDocumentSetup=false,
    noCamelCase=false
}: {
    slug: string;
    Child: ChildType;
    props?: object;
    preserveWrapping?: boolean;
    doDocumentSetup?: boolean;
    noCamelCase?: boolean;
}) {
    const data = usePageData<RawPageData>(slug, preserveWrapping, noCamelCase);

    if (!data) {
        return <LoadingPlaceholder />;
    }

    return (<LoadedPage {...{Child, data, props, doDocumentSetup, noCamelCase}} />);
}
