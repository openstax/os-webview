import React from 'react';
import Error404 from '~/pages/404/404';
import FlexPage from '~/pages/flex-page/flex-page';
import usePageData from '~/helpers/use-page-data';
import loadable from 'react-loadable';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import useLayoutContext from '~/contexts/layout';

const FallbackToGeneralPage = loadable({
    loader: () => import('./fallback-to-general.js'),
    loading: () => <h1>...General</h1>
});

export default function FallbackTo({name}) {
    const data = usePageData(`pages/${name}`, true);

    if (!data) {
        return <LoadingPlaceholder />;
    }

    return <LoadedPage name={name} data={data} />;
}

function LoadedPage({data, name}) {
    const {setLayoutParameters} = useLayoutContext();
    const hasError = 'error' in data;
    const isFlex =
        !hasError &&
        ['pages.FlexPage', 'pages.RootPage'].includes(data.meta.type);

    React.useEffect(() => {
        if (isFlex) {
            setLayoutParameters({
                data,
                name: data.layout[0]?.type || 'default'
            });
            return;
        }
        setLayoutParameters();
    }, [data, isFlex, setLayoutParameters]);

    // can we correctly identify missing pages here?
    // i think page-data-utils:fetchFromCMS would have to be updated
    // to do something special on a 404 status
    if (hasError) {
        return <Error404 />;
    }

    if (isFlex) {
        return <FlexPage data={data} />;
    }

    return <FallbackToGeneralPage name={name} />;
}
