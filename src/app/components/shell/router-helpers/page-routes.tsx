import React from 'react';
import {useParams, useLocation, Routes, Route, Navigate} from 'react-router-dom';
import usePageData from '~/helpers/use-page-data';
import FlexPage, {
    FlexPageData,
    LayoutUsingData
} from '~/pages/flex-page/flex-page';
import useLayoutContext from '~/contexts/layout';
import usePortalContext from '~/contexts/portal';
import {assertDefined, hasOnlySlugCharacters} from '~/helpers/data';
import {GeneralPageFromSlug} from '~/pages/general/general';
import {ImportedPage} from './page-loaders';
import {RouteAsPortalOrNot} from './portal-page-routes';
import Error404 from '~/pages/404/404';
import {NonPortalRouteWrapper} from './non-portal-route-wrapper';

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
    const {search, hash} = useLocation();
    const {linkPrefix} = usePortalContext();

    return (
        <Routes>
            <Route index element={<Navigate to={{pathname: `${linkPrefix}/subjects`, search, hash}} replace />} />
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
    const {pathname, search, hash} = useLocation();
    // The pathname keeps escapes that the router decodes in dir
    const [, rawDir, ...rest] = pathname.split('/');

    if (!hasOnlySlugCharacters(dir)) {
        return <Error404 />;
    }
    // A name with escapes, like %6Dy-portal, goes to its plain form so the
    // pathname starts with the page (or portal) name, as code that reads it
    // expects. The plain form never needs escapes, so this happens only once.
    if (rawDir !== dir) {
        return <Navigate to={{pathname: ['', dir, ...rest].join('/'), search, hash}} replace />;
    }
    return <NamedPageRoutes dir={dir} />;
}

function NamedPageRoutes({dir}: {dir: string}) {
    const {'*': path} = useParams();
    const {search, hash} = useLocation();

    if (['books', 'textbooks'].includes(dir)) {
        return (
            <NonPortalRouteWrapper>
                {path === '' ? <Error404 /> : (
                    <Routes>
                        <Route
                            path="/:title"
                            element={<RedirectToCanonicalDetailsPage />}
                        />
                    </Routes>
                )}
            </NonPortalRouteWrapper>
        );
    }

    if (dir === 'general') {
        return (
            <NonPortalRouteWrapper>
                <Navigate to={{pathname: `/${path}`, search, hash}} replace />
            </NonPortalRouteWrapper>
        );
    }

    if (dir === 'home') {
        return (
            <NonPortalRouteWrapper>
                <Navigate to={{pathname: '/', search, hash}} replace />
            </NonPortalRouteWrapper>
        );
    }

    // Some pages have no page data in the CMS!
    if (isNoDataPage(dir)) {
        return (
            <NonPortalRouteWrapper>
                <ImportedPage name={dir} />
            </NonPortalRouteWrapper>
        );
    }

    return <RouteAsPortalOrNot />;
}

const NO_DATA_PAGES = [
    'adopters',
    'adoption',
    'blog',
    'campaign',
    'confirmation',
    'institutional-partnership-application',
    'interest',
    'renewal-form',
    'separatemap'
];

export function isNoDataPage(dir: string) {
    return NO_DATA_PAGES.includes(dir);
}

// Like the top-level /:dir/* route, so that pages with their own routes, like
// the blog, match them below /<name>
export function generateNoDataPageRoutes() {
    return NO_DATA_PAGES.map((name) => (
        <Route
            path={`/${name}/*`}
            key={name}
            element={<ImportedPage name={name} />}
        />
    ));
}

// There are a couple of pages whose names in the CMS don't match their osweb urls
const mismatch: Record<string, string> = {
    press: 'news',
    'edtech-partner-program': 'openstax-ally-technology-partner-program',
    foundation: 'supporters'
};

// The CMS page name for the route, and the rest of the path after it
export function usePageNameFromRoute() {
    const {dir, '*': other} = useParams();

    // K12 subject pages render at /k12/<subject>; their CMS slugs are k12-<subject>.
    // The rest of the path keeps a trailing slash, which isn't part of the subject.
    return dir === 'k12' && other
        ? {name: `k12-${other.replace(/\/$/, '')}`, subPath: ''}
        : {name: assertDefined(dir), subPath: other};
}

export function usePageDataFromRoute() {
    const {name, subPath} = usePageNameFromRoute();
    const data = usePageData<PageData>(
        `pages/${mismatch[name] ?? name}`,
        true
    );
    const hasError = data && 'error' in data;

    return {name, data, hasError, other: subPath};
}

export function FlexPageUsingItsOwnLayout({data}: {data: FlexPageData}) {
    return (
        <LayoutUsingData data={data}>
            <FlexPage data={data} />
        </LayoutUsingData>
    );
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

export function RedirectToCanonicalDetailsPage() {
    const {title} = useParams();
    const {search, hash} = useLocation();
    const {linkPrefix} = usePortalContext();

    return <Navigate to={{pathname: `${linkPrefix}/details/books/${title}`, search, hash}} replace />;
}

const FOOTER_PAGES = [
    'license',
    'tos',
    'privacy',
    'privacy-policy',
    'accessibility-statement',
    'careers'
].map((s) => `/${s}`);

export function generateFooterPageRoutes() {
    return FOOTER_PAGES.map((path) => (
        <Route
            path={path}
            key={path}
            element={<ImportedPage name="footer-page" />}
        />
    ));
}
