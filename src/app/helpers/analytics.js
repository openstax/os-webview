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
        try {
            SystemJS.import('ga')
            .then(
                () => {
                    window.ga('send', fields);
                    window.ga('ga2.send', fields);
                },
                () => {
                    console.warn('GA FAILED TO IMPORT');
                }
            ).catch((e) => {
                console.warn('Caught trying to import ga:', e);
            });
        } catch (e) {
            console.warn('Caught SYSTEM JS nonsense', e);
        }
    }

    sendPageview(page) {
        if (linkHelper.isProduction()) {
            let frag = page || location.pathname;

            if (!(RELATIVE_TO_ROOT).test(frag)) {
                frag = `/${frag}`;
            }

            this.send({
                hitType: 'pageview',
                page: frag,
                location: location.href
            });
        }
    }

    sendEvent(fields) {
        this.send(Object.assign(
            {hitType: 'event'},
            fields
        ));
    }

    sendPageEvent(category, action, label) {
        const eventPacket = {
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            location: window.location.href
        };

        if (linkHelper.isProduction()) {
            this.sendEvent(eventPacket);
        } else {
            console.debug('[Non production] Send to analytics:', eventPacket);
        }
    }

    sendUrlEvent(category, href, action = 'download') {
        if (linkHelper.isProduction()) {
            const source = this.lookupUrl(href) || 'unknown';

            this.sendPageEvent(
                `${category} ${source}`,
                action,
                href
            );
        }
    }

    record(href) {
        if (linkHelper.isExternal(href)) {
            this.handleExternalLink(href);
        }

        if (linkHelper.isPDF(href)) {
            this.sendUrlEvent('PDF', href);
        }

        if (linkHelper.isZIP(href)) {
            this.sendUrlEvent('ZIP', href);
        }

        if (linkHelper.isTXT(href)) {
            this.sendUrlEvent('TXT', href);
        }
    }

    handleExternalLink(href) {
        if (linkHelper.isCNX(href)) {
            this.sendUrlEvent('Webview', href, 'open');
        } else if (linkHelper.isAmazon(href)) {
            this.sendUrlEvent('External', href, 'open');
        } else if (linkHelper.isCloudFront(href)) {
            return;
        } else {
            const partner = this.lookupUrl(href);

            if (partner !== '') {
                this.sendUrlEvent('Partner', href, 'open');
            } else {
                this.sendEvent({
                    eventCategory: 'External',
                    eventAction: 'open',
                    eventLabel: href,
                    location: location.href
                });
            }
        }
    }

    addBooksToLookupTable(bookData) {
        const urlMarker = {
            'high_resolution_pdf_url': 'Book HR',
            'low_resolution_pdf_url': 'Book LR',
            'webview_link': 'CNX',
            'amazon_link': 'Amazon'
        };

        for (const slug of Object.keys(bookData)) {
            const book = bookData[slug];

            for (const url of Object.keys(urlMarker)) {
                const resource = book[url];

                this.sourceByUrl[resource] = `${book.title} ${urlMarker[url]}`;
            }
        }
    }

    addResourcesToLookupTable(resourceItems) {
        const resourceMarker = {
            'book_student_resources': 'Student',
            'book_faculty_resources': 'Faculty'
        };

        for (const item of resourceItems) {
            for (const resourceBranch of Object.keys(resourceMarker)) {
                const marker = resourceMarker[resourceBranch];

                for (const resource of item[resourceBranch]) {
                    this.sourceByUrl[resource.link_document_url] = `${item.title} ${marker}`;
                }
            }
            for (const ally of item.book_allies) {
                const url = ally.book_link_url;

                this.sourceByUrl[url] = ally.ally_heading;
            }
        }
    }

    lookupUrl(selectedUrl) {
        if (selectedUrl in this.sourceByUrl) {
            return this.sourceByUrl[selectedUrl];
        }

        const found = Object.keys(this.sourceByUrl)
            .find(url => selectedUrl.localeCompare(url) === 0);

        return found ? this.sourceByUrl[found] : '';
    }

    fetchBooks() {
        /* eslint arrow-parens: 0 */
        (async () => {
            try {
                const response = await fetch(`${settings.apiOrigin}/api/books`);
                const data = await response.json();

                this.addBooksToLookupTable(data.books);
            } catch (e) {
                console.log(e);
            }
        })();

        /* eslint arrow-parens: 0 */
        (async () => {
            try {
                const response = await fetch(`${settings.apiOrigin}/api/v2/pages/?type=books.Book&fields`+
                  '=title,book_student_resources,book_faculty_resources,book_allies&limit=250');
                const bookFields = await response.json();

                this.addResourcesToLookupTable(bookFields.items);
            } catch (e) {
                console.log(e);
            }
        })();
    }

    [SETUP_GA]() {
        this.data = {};
        this.sourceByUrl = {};
        this.fetchBooks();
        if (typeof window.ga !== 'function') {
            window.GoogleAnalyticsObject = 'ga';
            window.ga = {
                q: [['create', settings.analyticsID, 'auto'],
                    ['create', settings.analyticsID2, 'auto', {name: 'ga2'}]],
                l: Date.now()
            };
        } else {
            window.ga('create', settings.analyticsID, 'auto');
            window.ga('create', settings.analyticsID2, 'auto', {name: 'ga2'});
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
