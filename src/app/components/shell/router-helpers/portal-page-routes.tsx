import React from 'react';
import {Routes, Route, Navigate, useLocation, useParams} from 'react-router-dom';
import Error404 from '~/pages/404/404';
import usePortalContext from '~/contexts/portal';
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
    hasOnlySlugCharacters,
    RedirectToCanonicalDetailsPage
} from './page-routes';
import {assertDefined} from '~/helpers/data';
import {ImportedPage} from './page-loaders';

// eslint-disable-next-line complexity
export function RouteAsPortalOrNot() {
    const {name, data, hasError, other} = usePageDataFromRoute();
    const {portalPrefix, setPortal, setIsK12Portal} = usePortalContext();
    const {pathname, search} = useLocation();

    if (!data) {
        return null;
    }

    if (hasError) {
        return <Error404 />;
    }

    const isFlex = !hasError && isFlexPage(data);
    const isPortal = isFlex && data.layout?.[0]?.type === 'landing';

    if (isPortal) {
        if (portalPrefix !== `/${name}`) {
            setPortal(assertDefined(name));
            // Check if this portal is linked to a K12 school
            const isK12 = data.schoolData?.industry === 'K12';

            setIsK12Portal(isK12);
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
    setIsK12Portal(false);
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

// Redirects /general/<page> to /<page>
function RedirectToPortalPage() {
    const {'*': page} = useParams();
    const {search} = useLocation();
    const {portalPrefix} = usePortalContext();

    return <Navigate to={{pathname: `${portalPrefix}/${page}`, search}} replace />;
}

// Redirects /home/… to the home page, which in a portal is the portal's own page
function RedirectToPortalRoot() {
    const {search} = useLocation();
    const {portalPrefix} = usePortalContext();

    return <Navigate to={{pathname: portalPrefix, search}} replace />;
}

function PortalSubRoute() {
    const {name} = usePageNameFromRoute();

    return hasOnlySlugCharacters(name) ? <PortalSubPage /> : <Error404 />;
}

function PortalSubPage() {
    const {data, hasError} = usePageDataFromRoute();
    // The page module is named for the route segment, which can differ from the
    // CMS page name: /k12/<subject> is the k12 page, which routes the subject itself
    const {dir} = useParams();

    if (hasError) {
        return <Error404 />;
    }

    if (isFlexPage(data)) {
        return <FlexPage data={assertDefined(data)} />;
    }

    if (data?.body) {
        return <GeneralPageFromSlug slug={`spike/${data?.meta.slug}`} />;
    }

    return <ImportedPage name={assertDefined(dir)} />;
}
