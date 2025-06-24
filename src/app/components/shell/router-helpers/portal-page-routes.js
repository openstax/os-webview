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
    DetailsRoutes
} from './page-routes';
import {assertDefined} from '~/helpers/data';
import {ImportedPage} from './page-loaders';

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
    const isPortal = isFlex && data.layout[0].type === 'landing';

    if (isPortal) {
        if (portalPrefix !== `/${name}`) {
            setPortal(assertDefined(name));
            return null;
        }
        if (!other) {
            return <FlexPageUsingItsOwnLayout data={data} />;
        }
        return (
            <LayoutUsingData data={data}>
                <Routes>
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

// eslint-disable-next-line complexity
export function PortalSubRoute() {
    const {name, data, hasError} = usePageDataFromRoute();

    if (!data) {
        return null;
    }

    if (hasError) {
        return <Error404 />;
    }

    const isFlex = !hasError && isFlexPage(data);

    if (isFlex) {
        return <FlexPage data={data} />;
    }
    const isGeneral = Boolean(data?.body);

    return isGeneral ? (
        <GeneralPageFromSlug slug={`spike/${data?.meta.slug}`} />
    ) : (
        <ImportedPage name={name} />
    );
}

