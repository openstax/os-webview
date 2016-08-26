import settings from 'settings';
import linkHelper from '~/helpers/link';

const RELATIVE_TO_ROOT = /^\//;
const SETUP_GTM = Symbol();

class Analytics {

    constructor() {
        this.start();
    }

    start() {
        this[SETUP_GTM]();
    }

    send(fields) {
        SystemJS.paths.gtm = `https://www.googletagmanager.com/gtm.js?id=${settings.tagManagerID}`;
        SystemJS.meta[SystemJS.paths.gtm] = SystemJS.meta['https://www.googletagmanager.com/gtm.js'];
        SystemJS.import('gtm').then(() => {
            window.dataLayer.push(fields);
        });
    }

    sendPageview(page) {
        let frag = page || location.pathname;

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

    [SETUP_GTM]() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });

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

const analytics = new Analytics();

export default analytics;
