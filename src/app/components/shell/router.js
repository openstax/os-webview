import React, {useEffect} from 'react';
import $ from '~/helpers/$';
import { PageTitleConfirmation } from './announce-page-title';
import {
    Routes,
    Route,
    Navigate,
    useLocation,
    useParams
} from 'react-router-dom';
import {assertNotNull, assertDefined} from '~/helpers/data';
import useLinkHandler from './router-helpers/use-link-handler';
import useRouterContext, {RouterContextProvider} from './router-context';
import loadable from 'react-loadable';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import useLayoutContext, { LayoutContextProvider } from '~/contexts/layout';
import PortalRouter from './portal-router';
import './skip-to-content.scss';

function useAnalyticsPageView() {
    const location = useLocation();
    const isRedirect = location.state?.redirect;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [isRedirect]);
}

const Fallback = loadable({
    loader: () => import('./router-helpers/fallback-to.js'),
    loading: () => <h1>...Loading</h1>
});

const Error404 = loadable({
    loader: () => import('~/pages/404/404'),
    loading: () => <h1>404</h1>
});

function useLoading(name) {
    const {pathname} = useLocation();

    return React.useCallback(
        ({error, pastDelay, retry}) => {
            if (error) {
                if (error.code === 'MODULE_NOT_FOUND') {
                    return pathname.endsWith('/')
                    ? <Fallback name={name} />
                    : <Navigate to={`${pathname}/`} replace />;
                }
                return <div>Error! <button onClick={ retry }>Retry</button></div>;
            }
            if (pastDelay) {
                return <LoadingPlaceholder />;
            }
            return null;
        },
        [name, pathname]
    );
}

function usePage(name) {
    const loading = useLoading(name);

    return React.useMemo(
        () => loadable({
            loader: () => import(`~/pages/${name}/${name}`),
            loading,
            render(loaded, props) {
                const Component = loaded.default;

                return <Component {...props} />;
            }
        }),
        [name, loading]
    );
}

function ImportedPage({name}) {
    const {pathname} = useLocation();
    const Page = usePage(name);
    const {portal} = useParams();
    const {setLayoutParameters, layoutParameters} = useLayoutContext();

    useAnalyticsPageView();

    // Scroll to the top when the pathname changes
    // (Avoids scrolling when going to a new tab)
    useEffect(
        () => window.scrollTo(0, 0),
        [name, pathname]
    );

    if (portal) {
        setLayoutParameters({name: 'landing', data: layoutParameters.data});
        if (layoutParameters.name !== 'landing') {
            return null;
        }
    }

    return <Page />;
}

const FOOTER_PAGES = [
    'license', 'tos', 'privacy', 'privacy-policy', 'accessibility-statement', 'careers'
].map((s) => `/${s}/`);

function TopLevelPage() {
    const {name} = useParams();
    const {isValid, goto404} = useRouterContext();

    if (!isValid || goto404) {
        return (<Error404 />);
    }

    return (
        <ImportedPage name={name} />
    );
}

function RedirectToCanonicalDetailsPage() {
    const {title} = useParams();

    return (
        <Navigate to={`/details/books/${title}`} replace />
    );
}

function MainRoutes() {
    const {Layout} = useLayoutContext();

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<ImportedPage name="home" />} />
                {
                    FOOTER_PAGES.map(
                        (path) => <Route path={path} key={path} element={<ImportedPage name="footer-page" />} />
                    )
                }
                <Route path="/errata/" element={<ImportedPage name="errata-summary" />} />
                <Route path="/errata/form/" element={<ImportedPage name="errata-form" />} />
                <Route path="/errata/*" element={<ImportedPage name="errata-detail" />} />
                <Route path="/details/books/:title" element={<ImportedPage name="details" />} />
                <Route path="/details/:title" element={<RedirectToCanonicalDetailsPage />} />
                <Route path="/details/" element={<Navigate to="/subjects" replace />} />
                <Route path="/books/:title" element={<RedirectToCanonicalDetailsPage />} />
                <Route path="/textbooks/:title" element={<RedirectToCanonicalDetailsPage />} />
                <Route path="/subjects/*" element={<ImportedPage name="subjects" />} />
                <Route path="/k12/*" element={<ImportedPage name="k12" />} />
                <Route path="/blog/*" element={<ImportedPage name="blog" />} />
                <Route path="/webinars/*" element={<ImportedPage name="webinars" />} />
                <Route path="/general/*" element={<ImportedPage name="general" />} />
                <Route path="/confirmation/*" element={<ImportedPage name="confirmation" />} />
                <Route path="/campaign/*" element={<ImportedPage name="campaign" />} />
                <Route path="/press/*" element={<ImportedPage name="press" />} />
                <Route
                    path="/edtech-partner-program"
                    element={<ImportedPage name="/openstax-ally-technology-partner-program" />}
                />
                <Route path="/:name/" element={<TopLevelPage />} />
                <Route path="/:portal/*" element={<PortalRouter />} />
                <Route element={<h1>Fell through</h1>} />
            </Routes>
        </Layout>
    );
}

export function RoutesAlsoInPortal() {
    return (
        <Routes>
            {
                FOOTER_PAGES.map(
                    (path) => <Route path={path} key={path} element={<ImportedPage name="footer-page" />} />
                )
            }
            <Route path="/errata/" element={<ImportedPage name="errata-summary" />} />
            <Route path="/errata/form/" element={<ImportedPage name="errata-form" />} />
            <Route path="/errata/*" element={<ImportedPage name="errata-detail" />} />
            <Route path="/details/books/:title" element={<ImportedPage name="details" />} />
            <Route path="/details/:title" element={<RedirectToCanonicalDetailsPage />} />
            <Route path="/details/" element={<Navigate to="/subjects" replace />} />
            <Route path="/books/:title" element={<RedirectToCanonicalDetailsPage />} />
            <Route path="/textbooks/:title" element={<RedirectToCanonicalDetailsPage />} />
            <Route path="/subjects/*" element={<ImportedPage name="subjects" />} />
            <Route path="/k12/*" element={<ImportedPage name="k12" />} />
            <Route path="/blog/*" element={<ImportedPage name="blog" />} />
            <Route path="/webinars/*" element={<ImportedPage name="webinars" />} />
            <Route path="/general/*" element={<ImportedPage name="general" />} />
            <Route path="/confirmation/*" element={<ImportedPage name="confirmation" />} />
            <Route path="/campaign/*" element={<ImportedPage name="campaign" />} />
            <Route path="/press/*" element={<ImportedPage name="press" />} />
            <Route
                path="/edtech-partner-program"
                element={<ImportedPage name="/openstax-ally-technology-partner-program" />}
            />
            <Route path="/:name/" element={<TopLevelPage />} />
        </Routes>
    );
}

function doSkipToContent(event) {
    event.preventDefault();
    const mainEl = document.getElementById('main');
    const target = assertDefined(assertNotNull(mainEl?.querySelector($.focusable)));

    $.scrollTo(target);
    target.focus();
}

function SkipToContent() {
    return (
        <a className="skiptocontent" href="#main" onClick={doSkipToContent}>skip to main content</a>
    );
}

export default function Router() {
    const linkHandler = useLinkHandler();
    const {origin, pathname} = window.location; // React-Router Location does not have origin
    const canonicalUrl = `${origin}${pathname}`;

    useEffect(() => {
        document.addEventListener('click', linkHandler);

        return () => document.removeEventListener('click', linkHandler);
    }, [linkHandler]);

    useEffect(() => {
        if ('piTracker' in window && window.piTracker instanceof Function) {
            window.piTracker(canonicalUrl);
        }
    }, [canonicalUrl]);

    return (
        <RouterContextProvider>
            <PageTitleConfirmation />
            <SkipToContent />
            <LayoutContextProvider>
                <MainRoutes />
            </LayoutContextProvider>
        </RouterContextProvider>
    );
}
