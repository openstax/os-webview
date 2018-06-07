import {Router} from 'superb.js';
import analytics from './helpers/analytics';
import linkHelper from './helpers/link';
import shell from './components/shell/shell';

const PAGES = [
    'about',
    'accessibility-statement',
    'adopters',
    'adoption',
    'adoption-confirmation',
    'article',
    'blog',
    'blog/*path',
    'books',
    'bookstore-suppliers',
    'bulk-order',
    'confirmation',
    'confirmation/*path',
    'contact',
    'details/*path',
    'errata/*path',
    'faq',
    'foundation',
    'give',
    'give/*path',
    'interest',
    'impact',
    'license',
    'openstax-tutor',
    'partners',
    'partners/*path',
    'press',
    'press/*path',
    'privacy-policy',
    'subjects',
    'subjects/*path',
    'technology',
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
        this.route(/^to[us]$/, 'tos');
        this.route('give-confirmation', 'give');
        this.route('interest-confirmation', 'confirmation');
        this.route('higher-ed', 'home');
        this.route('institutional-partnership-application', 'institutional-partnership');

        PAGES.forEach((page) => {
            const isSplat = page.match(/\/\*/);

            if (isSplat) {
                const basePage = page.substr(0, isSplat.index);
                const pageRegExp = new RegExp(`${basePage}/(.*)`);

                // TODO: Fix this loader so pages are included explicitly
                this.route(pageRegExp).load((params) => {
                    return System.import(`~/pages/${basePage}/${basePage}`).then((m) => {
                        const Controller = m.default;

                        this.defaultRegion.attach(new Controller(...params));
                    });
                });
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

        if (!el) {
            return;
        }

        const href = linkHelper.stripOpenStaxDomain(el.getAttribute('href'));

        e.preventDefault();

        if (linkHelper.isExternal(href) || el.target) {
            handleExternalLink(href);
        } else {
            this.navigate(href);
        }
    }

}

const router = new AppRouter();

export default router;
