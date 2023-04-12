import React, {useEffect} from 'react';
import {
    Routes,
    Route,
    Navigate,
    useLocation,
    useParams
} from 'react-router-dom';
import useLinkHandler from './router-helpers/useLinkHandler';
import useRouterContext, {RouterContextProvider} from './router-context';
import analytics from '~/helpers/analytics';
import loadable from 'react-loadable';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';

function useAnalyticsPageView() {
    const location = useLocation();
    const isRedirect = location.state?.redirect;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [isRedirect]);
}

const FallbackToGeneralPage = loadable({
    loader: () => import('./router-helpers/fallback-to-general.js'),
    loading: () => <h1>...General</h1>
});
const Error404 = loadable({
    loader: () => import('~/pages/404/404'),
    loading: () => <h1>404</h1>
});

function ImportedPage({name}) {
    const {pathname} = useLocation();
    const Page = React.useMemo(
        () => {
            function Loading({error, pastDelay, retry}) {
                if (error) {
                    if (error.code === 'MODULE_NOT_FOUND') {
                        return <FallbackToGeneralPage name={name} />;
                    }
                    return <div>Error! <button onClick={ retry }>Retry</button></div>;
                }
                if (pastDelay) {
                    return <LoadingPlaceholder />;
                }
                return null;
            }

            return loadable({
                loader: () => import(`~/pages/${name}/${name}`),
                loading: Loading
            });
        },
        [name]
    );

    useAnalyticsPageView();

    // Scroll to the top when the pathname changes
    // (Avoids scrolling when going to a new tab)
    useEffect(
        () => window.scrollTo(0, 0),
        [name, pathname]
    );


    return (<Page />);
}

const FOOTER_PAGES = [
    'license', 'tos', 'privacy', 'privacy-policy', 'accessibility-statement', 'careers'
].map((s) => `/${s}/`);

function TopLevelPage() {
    const {name} = useParams();
    const {isValid, goto404} = useRouterContext();

    React.useEffect(() => console.info('Top Level Render'), []);
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
    return (
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
            <Route path="/subjects-preview/*" element={<ImportedPage name="subjects" />} />
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
            <Route path="/:name/*" element={<TopLevelPage />} />
            <Route element={<h1>Fell through</h1>} />
        </Routes>
    );
}

export default function Router() {
    const linkHandler = useLinkHandler();
    const {origin, pathname} = useLocation();
    const canonicalUrl = `${origin}${pathname}`;

    useEffect(() => {
        document.addEventListener('click', linkHandler);

        return () => document.removeEventListener('click', linkHandler);
    }, [linkHandler]);

    useEffect(() => {
        // Track initial page view in Pardot
        if ('piTracker' in window) {
            piTracker(canonicalUrl);
        }
    }, [canonicalUrl]);

    return (
        <RouterContextProvider>
            <MainRoutes />
        </RouterContextProvider>
    );
}
