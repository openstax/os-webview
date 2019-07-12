import {Router} from 'superb.js';
import analytics from './helpers/analytics';
import linkHelper from './helpers/link';
import shell from './components/shell/shell';
import routerBus from '~/helpers/router-bus';

const PAGES = [
    'about',
    'adopters',
    'adoption',
    'adoption-confirmation',
    'annual-report',
    'article',
    'blog',
    'blog/*path',
    'bookstore-suppliers',
    'confirmation',
    'confirmation/*path',
    'contact',
    'details/*path',
    'faq',
    'foundation',
    'general/*path',
    'give',
    'give/*path',
    'hero-journey',
    'interest',
    'impact',
    'global-reach',
    'separatemap',
    'openstax-tutor',
    'partners',
    'partners/*path',
    'press',
    'press/*path',
    'research',
    'rover-3',
    'rover-by-openstax',
    'subjects',
    'subjects/*path',
    'team',
    'technology',
    'institutional-partnership-application',
    'institutional-partnership'
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

class AppRouter extends Router {

    init() {
        this.defaultRegion = shell.regions.main;

        this.default('404');
        this.root('home');
        this.route(/^(\d+)/, 'cms');
        this.route('errata/form', 'errata-form');
        this.route('errata/', 'errata-summary');
        this.route(/errata\/\d+/, 'errata-detail');
        this.route('give-confirmation', 'give');
        this.route('interest-confirmation', 'confirmation');
        this.route('higher-ed', 'home');
        ['license', 'tos', 'privacy-policy', 'accessibility-statement', 'careers']
            .forEach((pathname) => {
                this.route(pathname, 'footer-page');
            });

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

    start() {
        super.start();

        analytics.sendPageview(location.pathname);

        this.linkHandler = AppRouter.linkHandler.bind(this);
        document.addEventListener('click', this.linkHandler);
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

    static linkHandler(e) {
        const el = linkHelper.validUrlClick(e);

        if (!el || e.button !== 0) {
            return;
        }
        const handleExternalLink = (href) => {
            if (el.dataset.local === 'true') {
                document.location.href = href;
            } else {
                analytics.record(href);
                const newWindow = window.open(href, '_blank');

                if (newWindow === null) {
                    document.location.href = href;
                }
            }
        };
        const navigateTo = (href) => {
            const handleAsExternal = linkHelper.isExternal(href) || el.target;

            if (handleAsExternal) {
                handleExternalLink(href);
            } else {
                this.navigate(href || '/');
            }
        };

        e.preventDefault();
        // This was el.getAttribute('href'), but with a relative path, the login
        // url will not be recognized as external. This gets the fully-qualified
        // url.
        navigateTo(linkHelper.stripOpenStaxDomain(el.href));
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
