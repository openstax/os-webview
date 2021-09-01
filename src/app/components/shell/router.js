import React, {Suspense, useEffect} from 'react';
import {
    Switch,
    Route,
    Redirect,
    useLocation,
    useHistory,
    useParams
} from 'react-router-dom';
import Error404 from '~/pages/404/404';
import linkHelper from '~/helpers/link';
import retry from '~/helpers/retry';
import analytics from '~/helpers/analytics';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import useFlagContext from './flag-context';
import $ from '~/helpers/$';
import {fetchUser} from '~/pages/my-openstax/store/user';
import useRouterContext, {RouterContextProvider} from './router-context';

const FOOTER_PAGES = [
    'license', 'tos', 'privacy-policy', 'accessibility-statement', 'careers'
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
    const history = useHistory();

    function navigateTo(path, state = {x: 0, y: 0}) {
        history.push(linkHelper.stripOpenStaxDomain(path), state);
    }

    // eslint-disable-next-line complexity
    function linkHandler(e) {
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
            fetch(
                `${$.apiOriginAndOldPrefix}/salesforce/download-tracking/`,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(e.trackingInfo)
                }
            ).finally(followLink);
        } else {
            followLink();
        }
    }

    return linkHandler;
}

function ImportedPage({name}) {
    const history = useHistory();
    const {isValid} = useRouterContext();
    const isRedirect = history.location.state?.redirect;
    const Component = React.useMemo(
        () => React.lazy(() => retry(() => import(`~/pages/${name}/${name}`))),
        [name]
    );

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!isRedirect) {
            analytics.sendPageview();
        }
    }, [name, isRedirect]);

    if (!isValid) {
        return (<Error404 />);
    }

    return (
        <Suspense fallback={<LoadingPlaceholder />}>
            <Component />
        </Suspense>
    );
}

function useHomeOrMyOpenStax() {
    const [user, setUser] = React.useState({error: 'not loaded'});
    const isEnabled = useFlagContext();

    useEffect(() => fetchUser().then(setUser), []);

    return (user.error || !isEnabled) ? 'home' : 'my-openstax';
}

function TopLevelPage() {
    const {name} = useParams();

    return (
        <ImportedPage name={name} />
    );
}

function Routes() {
    const homeOrMyOpenStax = useHomeOrMyOpenStax();

    return (
        <Switch>
            <Route path="/" exact>
                <ImportedPage name={homeOrMyOpenStax} />
            </Route>
            <Route path={FOOTER_PAGES} exact>
                <ImportedPage name="footer-page" />
            </Route>
            <Route path="/errata/" exact>
                <ImportedPage name="errata-summary" />
            </Route>
            <Route path="/errata/form/">
                <ImportedPage name="errata-form" />
            </Route>
            <Route path="/errata/">
                <ImportedPage name="errata-detail" />
            </Route>
            <Route path="/books/:title">
                <Switch>
                    <Redirect exact from="/books/:title" to="/details/books/:title" />
                </Switch>
            </Route>
            <Route path="/:name">
                <TopLevelPage />
            </Route>
        </Switch>
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
            <Routes />
        </RouterContextProvider>
    );
}
