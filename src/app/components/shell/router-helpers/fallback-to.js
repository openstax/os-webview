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

export default function FallbackTo({name}) {
    const data = usePageData(`pages/${name}`, true);

    if (!data) {
        return <LoadingPlaceholder />;
    }

    // can we correctly identify missing pages here?
    // i think page-data-utils:fetchFromCMS would have to be updated
    // to do something special on a 404 status
    if ('error' in data) {
      return <Error404 />;
    }

    if (data.meta.type === 'pages.FlexPage') {
        return <FlexPage data={data} />;
    }

    return <FallbackToGeneralPage name={name} />;
}
