import React from 'react';
import {
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import Error404 from '~/pages/404/404';
import linkHelper from '~/helpers/link';
import analytics from '~/helpers/analytics';
import routerBus from '~/helpers/router-bus';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import useFlagContext from './flag-context';
import $ from '~/helpers/$';
import {fetchUser} from '~/pages/my-openstax/store/user';
import useRouterContext, {RouterContextProvider} from './router-context';

const PAGES = [
    'about',
    'adopters',
    'adoption',
    'annual-report',
    'article',
    'blog',
    'bookstore-suppliers',
    'campaign',
    'confirmation',
    'contact',
    'creator-fest',
    'details',
    'faq',
    'foundation',
    'general',
    'global-reach',
    'hero-journey',
    'impact',
    'institutional-partnership-application',
    'institutional-partnership',
    'interest',
    'llph',
    'openstax-tutor',
    'partners',
    'press',
    'research',
    'separatemap',
    'subjects',
    'team',
    'technology',
    'webinars'
];

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

function navigateTo(path, state = {x: 0, y: 0}) {
    history.pushState(state, '', linkHelper.stripOpenStaxDomain(path));
    window.dispatchEvent(new window.PopStateEvent('popstate', {state}));
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

function ImportedPage({name}) {
    const [Content, setContent] = React.useState(LoadingPlaceholder);

    React.useEffect(() => {
        import(`~/pages/${name}/${name}`).then((content) => {
            setContent(<content.default />);
            window.scrollTo(0, 0);
        });
        if (!(history.state && history.state.redirect)) {
            analytics.sendPageview();
        }
    }, [name]);

    return Content;
}

function canonicalUrl() {
    const loc = window.location;
    const path = loc.pathname;

    return `${loc.origin}${path}`;
}

function useHomeOrMyOpenStax() {
    const [user, setUser] = React.useState({error: 'not loaded'});
    const isEnabled = useFlagContext();

    React.useEffect(() => fetchUser().then(setUser), []);

    return (user.error || !isEnabled) ? 'home' : 'my-openstax';
}

function NormalRoutes() {
    const homeOrMyOpenStax = useHomeOrMyOpenStax();

    return (
        <Switch>
            {
                PAGES.map((pageName) =>
                    <Route key={pageName} path={`/${pageName}/`}>
                        <ImportedPage name={pageName} />
                    </Route>
                )
            }
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
            <Route>
                <Error404 />
            </Route>
        </Switch>
    );
}

function Routes() {
    const {isValid} = useRouterContext();

    return isValid ?
        <NormalRoutes /> :
        <Error404 />;
}

export default function Router() {
    React.useEffect(() => {
        document.addEventListener('click', linkHandler);

        // Track initial page view in Pardot
        if ('piTracker' in window) {
            piTracker(canonicalUrl());
        }

        return () => document.removeEventListener('click', linkHandler);
    }, []);

    return (
        <RouterContextProvider>
            <Routes />
        </RouterContextProvider>
    );
}

routerBus.on('navigate', (...args) => {
    navigateTo(...args);
    window.dispatchEvent(new window.CustomEvent('navigate'));
});
