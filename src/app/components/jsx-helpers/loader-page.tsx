import React from 'react';
import {fetchPageData} from '~/helpers/use-page-data';
import loadable from 'react-loadable';
import {setPageTitleAndDescriptionFromBookData, useCanonicalLink} from '~/helpers/use-document-head';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import Error404 from '~/pages/404/404';

type Data = {
    error?: unknown;
}
type LoadedPageProps = {
    Child: React.JSXElementConstructor<React.JSX.IntrinsicAttributes & {data: Data}>;
    data: Data;
    props: object;
    doDocumentSetup: boolean;
}

function LoadedPage({
    Child, data, props, doDocumentSetup
}: LoadedPageProps) {
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
        <Child {...{data, ...props}} />
    );
}

type LoaderPageProps = LoadedPageProps & {
    slug: string;
    preserveWrapping: boolean;
    noCamelCase: boolean;
}

const defaultProps = {};

export default function LoaderPage({
    slug, Child, props=defaultProps, preserveWrapping=false, doDocumentSetup=false,
    noCamelCase=false
}: LoaderPageProps) {
    const Page = React.useMemo(
        () => loadable({
            loader: () => fetchPageData(slug, preserveWrapping, noCamelCase),
            loading: LoadingPlaceholder,
            render(data: Data) {
                return <LoadedPage {...{Child, data, props, doDocumentSetup}} />;
            }
        }),
        [slug, Child, props, preserveWrapping, doDocumentSetup, noCamelCase]
    );

    return <Page />;
}
