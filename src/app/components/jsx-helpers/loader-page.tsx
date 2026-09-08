import React from 'react';
import {camelCaseKeys} from '~/helpers/page-data-utils';
import usePageData from '~/helpers/use-page-data';
import {setPageTitleAndDescriptionFromBookData, useCanonicalLink, BookData} from '~/helpers/use-document-head';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import LoadingFailure from '~/components/loading-placeholder/loading-failure';
import Error404 from '~/pages/404/404';

type RawPageData = {
    error?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChildType = (p: any) => React.JSX.Element;

type LoaderPageProps = {
    slug: string;
    Child: ChildType;
    props?: object;
    preserveWrapping?: boolean;
    doDocumentSetup?: boolean;
    noCamelCase?: boolean;
};

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

function PageAttempt({
    slug, Child, props, preserveWrapping, doDocumentSetup, noCamelCase, onRetry
}: Required<LoaderPageProps> & {onRetry: () => void}) {
    const [error, setError] = React.useState<Error>();
    const data = usePageData<RawPageData>(slug, preserveWrapping, noCamelCase, setError);

    if (error) {
        return <LoadingFailure onRetry={onRetry} />;
    }

    if (!data) {
        return <LoadingPlaceholder />;
    }

    return (<LoadedPage {...{Child, data, props, doDocumentSetup, noCamelCase}} />);
}

export default function LoaderPage({
    slug, Child, props={}, preserveWrapping=false, doDocumentSetup=false,
    noCamelCase=false
}: LoaderPageProps) {
    const [attempt, setAttempt] = React.useState(0);
    // A retry has to start the fetch over, and remounting is the plainest way
    // to reset both the hook and the error it reported.
    const onRetry = React.useCallback(() => setAttempt((count) => count + 1), []);

    return (
        <PageAttempt
            key={attempt}
            {...{slug, Child, props, preserveWrapping, doDocumentSetup, noCamelCase, onRetry}}
        />
    );
}
