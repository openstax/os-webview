import React from 'react';
import {
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import linkHelper from '~/helpers/link';
import analytics from '~/helpers/analytics';
import routerBus from '~/helpers/router-bus';
import $ from '~/helpers/$';

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
    const [Content, setContent] = React.useState(null);

    React.useEffect(() => {
        import(`~/pages/${name}/${name}`).then((content) => {
            setContent(<content.default />);
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

function error404() {
    const path404 = '/error/404';
    const path = window.location.pathname;

    if (!path.startsWith(path404)) {
        window.location = `${path404}?path=${path}`;
    }
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
        <Switch>
            {
                PAGES.map((pageName) =>
                    <Route key={pageName} path={`/${pageName}/`}>
                        <ImportedPage name={pageName} />
                    </Route>
                )
            }
            <Route path="/" exact>
                <ImportedPage name="home" />
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
            <Redirect from="/books/:title" to="/details/books/:title" />
            <Route path="*" render={error404} />
        </Switch>
    );
}

routerBus.on('navigate', (...args) => {
    navigateTo(...args);
    window.dispatchEvent(new window.CustomEvent('navigate'));
});
