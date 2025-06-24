import React from 'react';
import {useParams, Routes, Route, Navigate} from 'react-router-dom';
import usePageData from '~/helpers/use-page-data';
import FlexPage, {
    FlexPageData,
    LayoutUsingData
} from '~/pages/flex-page/flex-page';
import useLayoutContext from '~/contexts/layout';
import {assertDefined} from '~/helpers/data';
import {GeneralPageFromSlug} from '~/pages/general/general';
import {ImportedPage} from './page-loaders';
import {RouteAsPortalOrNot} from './portal-page-routes';

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

export function usePageDataFromRoute() {
    const {dir: name, '*': other} = useParams();
    const data = usePageData<PageData>(`pages/${mismatch[name as string] ?? name}`, true);
    const hasError = data && 'error' in data;

    return {name, data, hasError, other};
}

export function FlexPageUsingItsOwnLayout({data}: {data: FlexPageData}) {
    return <LayoutUsingData data={data}><FlexPage data={data} /></LayoutUsingData>;
}

export function NonFlexPageUsingDefaultLayout({data}: {data: PageData}) {
    const {dir: name} = useParams();
    const {setLayoutParameters} = useLayoutContext();
    const isGeneral = Boolean(data?.body);

    setLayoutParameters();

    return isGeneral ? (
        <GeneralPageFromSlug slug={`spike/${data?.meta.slug}`} />
    ) : (
        <ImportedPage name={name as string} />
    );
}

function RedirectToCanonicalDetailsPage() {
    const {title} = useParams();

    return <Navigate to={`/details/books/${title}`} replace />;
}
