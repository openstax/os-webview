import React, {Suspense, useEffect} from 'react';
import {
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
    useParams
} from 'react-router-dom';
import Error404 from '~/pages/404/404';
import {GeneralPageFromSlug} from '~/pages/general/general';
import linkHelper from '~/helpers/link';
import retry from '~/helpers/retry';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import $ from '~/helpers/$';
import {useToggle} from '~/helpers/data';
import useRouterContext, {RouterContextProvider} from './router-context';

const FOOTER_PAGES = [
    'license', 'tos', 'privacy', 'privacy-policy', 'accessibility-statement', 'careers'
].map((s) => `/${s}/`);

// eslint-disable-next-line complexity
function handleExternalLink(href, el) {
    if (el.dataset.local === 'true') {
        document.location.href = href;
    } else {
        const newWindow = window.open(href, '_blank');

        if (newWindow === null) {
            document.location.href = href;
        }
    }
}

function useLinkHandler() {
    const navigate = useNavigate();
    const navigateTo = React.useCallback(
        (path, state = {x: 0, y: 0}) => {
            navigate(linkHelper.stripOpenStaxDomain(path), state);
        },
        [navigate]
    );
    const linkHandler = React.useCallback(
        // eslint-disable-next-line complexity
        (e) => {
            // Only handle left-clicks on links
            const el = linkHelper.validUrlClick(e);

            if (!el || e.button !== 0) {
                return;
            }
            e.preventDefault();

            const fullyQualifiedHref = el.href;
            const followLink = (el.target || linkHelper.isExternal(fullyQualifiedHref)) ?
                () => handleExternalLink(fullyQualifiedHref, el) :
                () => navigateTo(fullyQualifiedHref);

            // Pardot tracking
            if ('piTracker' in window) {
                piTracker(fullyQualifiedHref.split('#')[0]);
            }

            if (e.trackingInfo) {
                retry(
                    () => fetch(
                        `${$.apiOriginAndOldPrefix}/salesforce/download-tracking/`,
                        {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(e.trackingInfo)
                        }
                    )
                )
                    .catch((err) => {throw new Error(`Unable to download-track: ${err}`);})
                    .finally(followLink);
            } else {
                followLink();
            }
        },
        [navigateTo]
    );

    return linkHandler;
}

function useAnalyticsPageView() {
    const location = useLocation();
    const isRedirect = location.state?.redirect;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [isRedirect]);
}

// Dynamic import is persnickety about building paths; you can't just pass it
// a string with a path, it needs to know it's building a string
// Then webpack chunks everything that matches that string (in this case, all pages)
// in one chunk. Not as dynamic as one might hope.
function useImportedComponent(name) {
    const importFn = React.useCallback(() => import(`~/pages/${name}/${name}`), [name]);
    const [loadState, setLoadState] = React.useState({});
    const loadError = React.useMemo(
        () => loadState.name === name ? loadState.error : null,
        [loadState, name]
    );
    const Component = React.useMemo(
        () => React.lazy(() => importFn()
            .catch((error) => {
                setLoadState({ name, error });
            })),
        [importFn, name]
    );

    return {Component, loadError};
}

function FallbackToGeneralPage({name}) {
    const [fallback, setFallback] = useToggle(false);

    if (fallback) {
        return (<Error404 />);
    }
    return (
        <GeneralPageFromSlug slug={`spike/${name}`} fallback={setFallback} />
    );
}

function ImportedPage({name}) {
    const {Component, loadError} = useImportedComponent(name);
    const {pathname} = useLocation();

    useAnalyticsPageView();

    // Scroll to the top when the pathname changes
    // (Avoids scrolling when going to a new tab)
    useEffect(
        () => window.scrollTo(0, 0),
        [name, pathname]
    );

    if (loadError) {
        return (<FallbackToGeneralPage name={name} />);
    }

    return (
        <Suspense fallback={<LoadingPlaceholder />}>
            <Component />
        </Suspense>
    );
}

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
            <Route path="/subjects/*" element={<ImportedPage name="subjects" />} />
            <Route path="/subjects-preview/*" element={<ImportedPage name="subjects" />} />
            <Route path="/k12/*" element={<ImportedPage name="k12" />} />
            <Route path="/blog/*" element={<ImportedPage name="blog" />} />
            <Route path="/general/*" element={<ImportedPage name="general" />} />
            <Route path="/confirmation/*" element={<ImportedPage name="confirmation" />} />
            <Route path="/campaign/*" element={<ImportedPage name="campaign" />} />
            <Route path="/press/*" element={<ImportedPage name="press" />} />
            <Route
                path="/edtech-partner-program"
                element={<ImportedPage name="/openstax-ally-technology-partner-program" />}
            />
            <Route path="/:name" element={<TopLevelPage />} />
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
