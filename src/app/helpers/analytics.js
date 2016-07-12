import Backbone from 'backbone';
import settings from 'settings';
import linkHelper from '~/helpers/link';

const RELATIVE_TO_ROOT = /^\//;
const SETUP_GA = Symbol();

class Analytics {

    constructor() {
        this[SETUP_GA]();
        this.setupGTM();
    }

    setupGTM() {
        (function (w, d, s, l, i) {
            // Disable ESLint rules since we're copying Google's script
            /* eslint max-params: 0 */
            /* eslint eqeqeq: 0 */
            /* eslint prefer-template: 0 */

            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });

            let f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l !== 'dataLayer' ? '&l=' + l : '';

            j.async = true;
            j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', settings.tagManagerID);
    }

    send(fields) {
        System.import('ga').then(() => {
            window.ga('send', fields);
        });
    }

    sendPageview(page) {
        let frag = page || Backbone.history.fragment;

        if (!(RELATIVE_TO_ROOT).test(frag)) {
            frag = `/${frag}`;
        }

        this.send({
            hitType: 'pageview',
            page: frag
        });
    }

    sendEvent(fields) {
        this.send(Object.assign(
            {hitType: 'event'},
            fields
        ));
    }

    record(href) {
        if (linkHelper.isPDF(href)) {
            this.sendEvent({
                eventCategory: 'PDF',
                eventAction: 'download',
                eventLabel: href
            });
        }

        if (linkHelper.isExternal(href)) {
            this.sendEvent({
                eventCategory: 'External',
                eventAction: 'open',
                eventLabel: href
            });
        }
    }

    [SETUP_GA]() {
        if (typeof window.ga !== 'function') {
            window.GoogleAnalyticsObject = 'ga';
            window.ga = {
                q: [['create', settings.analyticsID, 'auto']],
                l: Date.now()
            };
        } else {
            window.ga('create', settings.analyticsID, 'auto');
        }

        document.addEventListener('submit', (e) => {
            if (typeof e.target !== 'object' || typeof e.target.action !== 'string') {
                return;
            }

            if (e.target.action.indexOf('https://www.salesforce.com/') === 0) {
                const formData = new FormData(e.target);

                this.sendEvent({
                    eventCategory: 'Salesforce',
                    eventAction: 'submit',
                    eventLabel: formData.get('lead_source')
                });
            }
        });
    }

}

let analytics = new Analytics();

export default analytics;
