import React, {useEffect} from 'react';
import {FetchStateType} from '@openstax/ts-utils/fetch';
import {Routes, Route, Navigate, useLocation, useParams} from 'react-router-dom';
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
    usePageNameFromRoute,
    FlexPageUsingItsOwnLayout,
    NonFlexPageUsingDefaultLayout,
    DetailsRoutes,
    ErrataRoutes,
    generateFooterPageRoutes,
    generateNoDataPageRoutes,
    RedirectToCanonicalDetailsPage
} from './page-routes';
import {assertDefined} from '~/helpers/data';
import {hasOnlySlugCharacters} from '~/helpers/url-from-slug';
import {ImportedPage} from './page-loaders';

// eslint-disable-next-line complexity
export function RouteAsPortalOrNot() {
    const {name, data, hasError, other} = usePageDataFromRoute();
    const {portalPrefix, setPortal, setSchoolData} = usePortalContext();
    const {pathname, search, hash} = useLocation();
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
            setSchoolData(schoolData);
            return null;
        }

        if (!other) {
            return <FlexPageUsingItsOwnLayout data={data} />;
        }

        return (
            <LayoutUsingData data={data}>
                <Routes>
                    {generateFooterPageRoutes()}
                    {generateNoDataPageRoutes()}
                    <Route path="/details/*" element={<DetailsRoutes />} />
                    <Route path="/errata/*" element={<ErrataRoutes />} />
                    {/* The same redirects as the top-level router */}
                    <Route path="/books/:title" element={<RedirectToCanonicalDetailsPage />} />
                    <Route path="/textbooks/:title" element={<RedirectToCanonicalDetailsPage />} />
                    <Route path="/general/*" element={<RedirectToPortalPage />} />
                    <Route path="/home/*" element={<RedirectToPortalRoot />} />
                    <Route path="/:dir/*" element={<PortalSubRoute />} />
                </Routes>
            </LayoutUsingData>
        );
    }

    setPortal('');
    setSchoolData(null);
    if (isFlex) {
        // Non-portal flex pages do not have children, and /name/ is the same
        // page as /name; keep it canonical
        if (other || pathname.endsWith('/')) {
            return <Navigate to={{pathname: `/${name}`, search, hash}} replace />;
        }
        return <FlexPageUsingItsOwnLayout data={data} />;
    }
    return <NonFlexPageUsingDefaultLayout data={data} />;
}

// Redirects /general/<page> to /<page>
function RedirectToPortalPage() {
    const {'*': page} = useParams();
    const {search, hash} = useLocation();
    const {portalPrefix} = usePortalContext();

    return <Navigate to={{pathname: `${portalPrefix}/${page}`, search, hash}} replace />;
}

// Redirects /home/… to the home page, which in a portal is the portal's own page
function RedirectToPortalRoot() {
    const {search, hash} = useLocation();
    const {portalPrefix} = usePortalContext();

    return <Navigate to={{pathname: portalPrefix, search, hash}} replace />;
}

function PortalSubRoute() {
    const {name} = usePageNameFromRoute();

    return hasOnlySlugCharacters(name) ? <PortalSubPage /> : <Error404 />;
}

function PortalSubPage() {
    const {pageData, data, hasError} = usePageDataFromRoute();
    // The page module is named for the route segment, which can differ from the
    // CMS page name: /k12/<subject> is the k12 page, which routes the subject itself
    const {dir} = useParams();

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

    return <ImportedPage name={assertDefined(dir)} />;
}
