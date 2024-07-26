import React from 'react';
import Error404 from '~/pages/404/404';
import FlexPage from '~/pages/flex-page/flex-page';
import usePageData from '~/helpers/use-page-data';
import loadable from 'react-loadable';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';

const FallbackToGeneralPage = loadable({
    loader: () => import('./fallback-to-general.js'),
    loading: () => <h1>...General</h1>
});
const Layout = ({name, children, data}) => {
    const LoadableLayout = loadable({
        loader: () => import(`~/layouts/${name}/${name}`),
        loading: LoadingPlaceholder
    });

    return <LoadableLayout data={data}>{children}</LoadableLayout>;
};

export default function FallbackTo({name}) {
    const data = usePageData(`pages/${name}`, true);

    if (!data) {
        return <LoadingPlaceholder />;
    }

    // can we correctly identify missing pages here?
    // i think page-data-utils:fetchFromCMS would have to be updated
    // to do something special on a 404 status
    if ('error' in data) {
        return <Layout name="default"><Error404 /></Layout>;
    }

    if (['pages.FlexPage', 'pages.RootPage'].includes(data.meta.type)) {
        return <Layout data={data} name={data.layout[0]?.type || 'default'}>
            <FlexPage data={data} />
        </Layout>;
    }

    return <Layout name="default">
        <FallbackToGeneralPage name={name} />
    </Layout>;
}
