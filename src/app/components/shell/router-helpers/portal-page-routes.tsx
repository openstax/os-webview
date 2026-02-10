import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Error404 from '~/pages/404/404';
import usePortalContext from '~/contexts/portal';
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
    isNoDataPage
} from './page-routes';
import {assertDefined} from '~/helpers/data';
import {ImportedPage} from './page-loaders';
import {FOOTER_PAGES} from '../router';

// eslint-disable-next-line complexity
export function RouteAsPortalOrNot() {
    const {name, data, hasError, other} = usePageDataFromRoute();
    const {portalPrefix, setPortal} = usePortalContext();

    if (!data) {
        return null;
    }

    if (hasError) {
        return <Error404 />;
    }

    const isFlex = !hasError && isFlexPage(data);
    const isPortal = isFlex && data.layout[0]?.type === 'landing';

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
                    {FOOTER_PAGES.map((path) => (
                        <Route
                            path={path}
                            key={path}
                            element={<ImportedPage name="footer-page" />}
                        />
                    ))}
                    <Route path="/details/*" element={<DetailsRoutes />} />
                    <Route path="/:dir/*" element={<PortalSubRoute />} />
                </Routes>
            </LayoutUsingData>
        );
    }

    setPortal('');
    if (isFlex) {
        if (other) {
            // Non-portal flex pages do not have children; keep it canonical
            return <Navigate to={`/${name}`} />;
        }
        return <FlexPageUsingItsOwnLayout data={data} />;
    }
    return <NonFlexPageUsingDefaultLayout data={data} />;
}

function PortalSubRoute() {
    const {name, data, hasError} = usePageDataFromRoute();

    if (hasError) {
        return <Error404 />;
    }

    if (isFlexPage(data)) {
        return <FlexPage data={assertDefined(data)} />;
    }

    if (data?.body) {
        return <GeneralPageFromSlug slug={`spike/${data?.meta.slug}`} />;
    }

    return <ImportedPage name={assertDefined(name)} />;
}
