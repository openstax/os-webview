import settings from 'settings';
import linkHelper from '~/helpers/link';

const RELATIVE_TO_ROOT = /^\//;

const SETUP_GA = Symbol();

class Analytics {

    constructor() {
        this.start();
    }

    start() {
        this[SETUP_GA]();
    }

    send(fields) {
        SystemJS.import('ga').then(() => {
            window.ga('send', fields);
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
        if (linkHelper.isExternal(href)) {
            this.sendEvent({
                eventCategory: 'External',
                eventAction: 'open',
                eventLabel: href
            });
        }

        if (linkHelper.isPDF(href)) {
            this.sendEvent({
                eventCategory: 'PDF',
                eventAction: 'download',
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

const analytics = new Analytics();

export default analytics;
