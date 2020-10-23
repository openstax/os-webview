import {Router} from 'superb.js';
import analytics from './helpers/analytics';
import linkHelper from './helpers/link';
import shell from './components/shell/shell';
import routerBus from '~/helpers/router-bus';
import $ from '~/helpers/$';

const path404 = '/error/404';
const PAGES = [
    'about',
    'adopters',
    'adoption',
    'annual-report',
    'article',
    'blog',
    'blog/*path',
    'bookstore-suppliers',
    'confirmation',
    'confirmation/*path',
    'contact',
    'creator-fest',
    'creator-fest/*path',
    'details/*path',
    'faq',
    'foundation',
    'general/*path',
    'global-reach',
    'hero-journey',
    'impact',
    'institutional-partnership-application',
    'institutional-partnership',
    'interest',
    'openstax-tutor',
    'partners',
    'partners/*path',
    'press',
    'press/*path',
    'quiz-results/*path',
    'research',
    'separatemap',
    'subjects',
    'subjects/*path',
    'team',
    'technology',
    'webinars'
];

if (window.location.hostname === 'localhost') {
    PAGES.push('a-page-template');
    PAGES.push('a-example');
}

// CustomEvent polyfill
(function () {
    if (typeof window.CustomEvent === 'function') {
        return;
    }

    function CustomEvent(event, params={ bubbles: false, cancelable: false }) {
        const evt = document.createEvent('CustomEvent');

        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

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
};

function linkHandler(e) {
    const el = linkHelper.validUrlClick(e);

    if (!el || e.button !== 0) {
        return;
    }
    const fullyQualifiedHref = el.href;
    const navigateTo = (href) => {
        const internalLink = this.canRoute(href);
        const handleAsExternal = linkHelper.isExternal(href) || el.target ||
            !internalLink;

        if (handleAsExternal) {
            handleExternalLink(href, el);
        } else {
            this.navigate(linkHelper.stripOpenStaxDomain(href) || '/');
        }
    };

    // Pardot tracking
    if ('piTracker' in window) {
        piTracker(fullyQualifiedHref.split('#')[0]);
    }
    e.preventDefault();
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
        ).finally(() => navigateTo(fullyQualifiedHref));
    } else {
        navigateTo(fullyQualifiedHref);
    }
}

class AppRouter extends Router {

    init() {
        this.defaultRegion = shell.regions.main;

        this.root('home');
        this.route(/^(\d+)/, 'cms');
        this.route('errata/form', 'errata-form');
        this.route('errata/', 'errata-summary');
        this.route(/errata\/\d+/, 'errata-detail');
        this.route('higher-ed', 'home');
        ['license', 'tos', 'privacy-policy', 'accessibility-statement', 'careers']
            .forEach((pathname) => {
                this.route(pathname, 'footer-page');
            });
        this.route(path404.substr(1), '404');

        PAGES.forEach((page) => {
            const isSplat = page.match(/\/\*/);

            if (isSplat) {
                const basePage = page.substr(0, isSplat.index);
                const pageRegExp = new RegExp(`${basePage}/.*`);

                this.route(pageRegExp, basePage);
            } else {
                this.route(page);
            }
        });
    }

    canRoute(href) {
        let path;

        try {
            path = (new URL(href)).pathname;
        } catch (_) {
            path = href;
        }

        return path === '/' || this.routes.some((r) => {
            return r.path.test(path.substr(1));
        });
    }

    start() {
        const loc = window.location;
        const path = loc.pathname;
        const canonicalUrl = `${loc.origin}${path}`;

        if (!this.canRoute(path) && !path.startsWith(path404)) {
            window.location = `${path404}?path=${path}`;
        }
        super.start();

        analytics.sendPageview(path);

        this.linkHandler = linkHandler.bind(this);
        document.addEventListener('click', this.linkHandler);
        // Track initial page view in Pardot
        if ('piTracker' in window) {
            piTracker(canonicalUrl);
        }
    }

    stop() {
        super.stop();

        document.removeEventListener('click', this.linkHandler);
    }

    navigate(...args) {
        super.navigate(...args);
        window.dispatchEvent(new CustomEvent('navigate'));
        if (args.length === 1) {
            analytics.sendPageview();
        }
    }

}

const router = new AppRouter();

routerBus.on('navigate', (...args) => {
    router.navigate(...args);
});

routerBus.on('replaceState', (...args) => {
    router.replaceState(...args);
});

export default router;
