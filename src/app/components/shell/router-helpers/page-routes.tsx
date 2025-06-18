import React from 'react';
import {useParams, Routes, Route, Navigate} from 'react-router-dom';
import usePageData from '~/helpers/use-page-data';
import Error404 from '~/pages/404/404';
import FlexPage, {
    FlexPageData,
    isFlexPage,
    useDataToSetLayoutParameters
} from '~/pages/flex-page/flex-page';
import useLayoutContext from '~/contexts/layout';
import usePortalContext from '~/contexts/portal';
import {assertDefined} from '~/helpers/data';
import {GeneralPageFromSlug} from '~/pages/general/general';
import {ImportedPage} from './page-loaders';

type PageData = FlexPageData & {
    meta: {slug: string};
};

export function HomePage() {
    const data = usePageData<PageData>('pages/home', true);

    if (!data) {
        return null;
    }
    return <FlexPageUsingItsOwnLayout data={data} />;
}

export function ErrataRoutes() {
    return (
        <Routes>
            <Route index element={<ImportedPage name="errata-summary" />} />
            <Route
                path="/form/"
                element={<ImportedPage name="errata-form" />}
            />
            <Route path="/*" element={<ImportedPage name="errata-detail" />} />
        </Routes>
    );
}

export function DetailsRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to="/subjects" replace />} />
            <Route
                path="/books/:title"
                element={<ImportedPage name="details" />}
            />
            <Route
                path="/:title"
                element={<RedirectToCanonicalDetailsPage />}
            />
        </Routes>
    );
}

export function OtherPageRoutes() {
    const dir = assertDefined(useParams().dir);

    if (['books', 'textbooks'].includes(dir)) {
        return (
            <Routes>
                <Route
                    path="/:title"
                    element={<RedirectToCanonicalDetailsPage />}
                />
            </Routes>
        );
    }

    if (dir === 'home') {
        return <Navigate to="/" replace />;
    }

    return <RouteAsPortalOrNot />;
}


// There are a couple of pages whose names in the CMS don't match their osweb urls
const mismatch: Record<string, string> = {
    press: 'news',
    'edtech-partner-program': 'openstax-ally-technology-partner-program'
};

function usePageDataFromRoute() {
    const {dir: name, '*': other} = useParams();
    const data = usePageData<PageData>(`pages/${mismatch[name as string] ?? name}`, true);
    const hasError = data && 'error' in data;

    return {name, data, hasError, other};
}

// eslint-disable-next-line complexity
function RouteAsPortalOrNot() {
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
            return <FlexPage data={data} />;
        }
        return <PortalRoute data={data} />;
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

function FlexPageUsingItsOwnLayout({data}: {data: FlexPageData}) {
    return useDataToSetLayoutParameters(data) ? null : <FlexPage data={data} />;
}

function NonFlexPageUsingDefaultLayout({data}: {data: PageData}) {
    const {dir: name} = useParams();
    const {setLayoutParameters} = useLayoutContext();
    const isGeneral = Boolean(data?.body);

    setLayoutParameters();

    return isGeneral ? (
        <GeneralPageFromSlug slug={`spike/${data?.meta.slug}`} />
    ) : (
        <ImportedPage name={name} />
    );
}

function PortalRoute({data}: {data: FlexPageData}) {
    if (useDataToSetLayoutParameters(data)) {
        return null;
    }

    return (
        <Routes>
            <Route path="/details/*" element={<DetailsRoutes />} />
            <Route path="/:dir/*" element={<PortalSubRoute />} />
        </Routes>
    );
}

// eslint-disable-next-line complexity
function PortalSubRoute() {
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

function RedirectToCanonicalDetailsPage() {
    const {title} = useParams();

    return <Navigate to={`/details/books/${title}`} replace />;
}
