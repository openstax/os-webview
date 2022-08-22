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
import analytics from '~/helpers/analytics';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import $ from '~/helpers/$';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useUserContext from '~/contexts/user';
import useRouterContext, {RouterContextProvider} from './router-context';

const FOOTER_PAGES = [
    'license', 'tos', 'privacy', 'privacy-policy', 'accessibility-statement', 'careers'
].map((s) => `/${s}/`);

function instructorResourceNodeContaining(el) {
    const resourcesSections = Array.from(
        document.querySelectorAll('.instructor-resources .resources .resource-box')
    );

    return resourcesSections.find((node) => node.contains(el));
}

// eslint-disable-next-line complexity
function handleExternalLink(href, el) {
    if (el.dataset.local === 'true') {
        // REX books open in the current window; track them
        if (linkHelper.isREX(href)) {
            analytics.record(href);
        }
        document.location.href = href;
    } else {
        const irNode = instructorResourceNodeContaining(el);

        if (linkHelper.isTOCLink(el)) {
            analytics.sendTOCEvent(href);
        } else if (irNode) {
            const title = irNode.querySelector('.top-line').textContent;

            analytics.sendInstructorResourceEvent(title, href);
        } else {
            analytics.record(href);
        }
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
        if (!isRedirect) {
            analytics.sendPageview();
        }
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

function useHomeOrMyOpenStax() {
    const {myOpenStaxUser} = useUserContext();

    return myOpenStaxUser.error ? 'home' : 'my-openstax';
}

function TopLevelPage() {
    const {name} = useParams();
    const [fallback, setFallback] = useToggle(false);
    const {isValid, goto404} = useRouterContext();

    if (!isValid || goto404) {
        return (<Error404 />);
    }

    if (fallback) {
        return (<FallbackToGeneralPage name={name} />);
    }

    return (
        <ImportedPage name={name} fallback={setFallback} />
    );
}

function RedirectToCanonicalDetailsPage() {
    const {title} = useParams();

    return (
        <Navigate to={`/details/books/${title}`} replace />
    );
}

function MainRoutes() {
    const homeOrMyOpenStax = useHomeOrMyOpenStax();

    return (
        <Routes>
            <Route path="/" element={<ImportedPage name={homeOrMyOpenStax} />} />
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
            <Route path="/books/:title" element={<RedirectToCanonicalDetailsPage />} />
            <Route path="/textbooks/:title" element={<RedirectToCanonicalDetailsPage />} />
            <Route path="/subjects/*" element={<ImportedPage name="subjects" />} />
            <Route path="/blog/*" element={<ImportedPage name="blog" />} />
            <Route path="/general/*" element={<ImportedPage name="general" />} />
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
