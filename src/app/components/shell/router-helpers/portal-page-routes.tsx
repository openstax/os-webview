import React, {useEffect} from 'react';
import {FetchStateType} from '@openstax/ts-utils/fetch';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Error404 from '~/pages/404/404';
import usePortalContext from '~/contexts/portal';
import {initializeAnalytics} from '~/helpers/tag-manager';
import FlexPage, {
    isFlexPage,
    LayoutUsingData
} from '~/pages/flex-page/flex-page';
import {GeneralPageFromSlug} from '~/pages/general/general';
import {
    usePageDataFromRoute,
    FlexPageUsingItsOwnLayout,
    NonFlexPageUsingDefaultLayout,
    DetailsRoutes,
    isNoDataPage,
    generateFooterPageRoutes
} from './page-routes';
import {assertDefined} from '~/helpers/data';
import {ImportedPage} from './page-loaders';

// eslint-disable-next-line complexity
export function RouteAsPortalOrNot() {
    const {name, data, hasError, other} = usePageDataFromRoute();
    const {portalPrefix, setPortal} = usePortalContext();
    const {pathname, search} = useLocation();
    const isFlex = !hasError && isFlexPage(data);
    const isPortal = isFlex && data.layout?.[0]?.type === 'landing';
    const schoolData = isPortal ? data.schoolData : null;

    useEffect(() => {
        if (data && !hasError) {
            initializeAnalytics(schoolData);
        }
    }, [data, hasError, schoolData]);

    if (!data) {
        return null;
    }

    if (hasError) {
        return <Error404 />;
    }

    if (isPortal) {
        if (portalPrefix !== `/${name}`) {
            setPortal(assertDefined(name));
            return null;
        }

        if (!other) {
            return <FlexPageUsingItsOwnLayout data={data} />;
        }

        if (isNoDataPage(other)) {
            return (
                <LayoutUsingData data={data}>
                    <ImportedPage name={other} />
                </LayoutUsingData>
            );
        }

        return (
            <LayoutUsingData data={data}>
                <Routes>
                    {generateFooterPageRoutes()}
                    <Route path="/details/*" element={<DetailsRoutes />} />
                    <Route path="/:dir/*" element={<PortalSubRoute />} />
                </Routes>
            </LayoutUsingData>
        );
    }

    setPortal('');
    if (isFlex) {
        // Non-portal flex pages do not have children, and /name/ is the same
        // page as /name; keep it canonical
        if (other || pathname.endsWith('/')) {
            return <Navigate to={{pathname: `/${name}`, search}} replace />;
        }
        return <FlexPageUsingItsOwnLayout data={data} />;
    }
    return <NonFlexPageUsingDefaultLayout data={data} />;
}

function PortalSubRoute() {
    const {name, pageData, data, hasError} = usePageDataFromRoute();

    // Waiting avoids importing a page by name before knowing it has no CMS data.
    // A page whose data failed to load still falls through to ImportedPage below.
    if (pageData.type === FetchStateType.LOADING) {
        return null;
    }

    if (hasError) {
        return <Error404 />;
    }

    if (isFlexPage(data)) {
        return <FlexPage data={data} />;
    }

    if (data?.body) {
        return <GeneralPageFromSlug slug={`spike/${data.meta.slug}`} />;
    }

    return <ImportedPage name={assertDefined(name)} />;
}
