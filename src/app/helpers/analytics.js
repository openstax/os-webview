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
            page: frag,
            location: location.href
        });
    }

    sendEvent(fields) {
        this.send(Object.assign(
            {hitType: 'event'},
            fields
        ));
    }

    sendUrlEvent(category, href, action = 'download') {
        const source = this.lookupUrl(href) || 'unknown';

        this.sendEvent({
            eventCategory: `${category} ${source}`,
            eventAction: action,
            eventLabel: href,
            location: location.href
        });
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
            sendUrlEvent('CNX', href, 'open');
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

    buildUrlLookupTable(bookData) {
        const urlMarker = {
            'high_resolution_pdf_url': 'Book HR',
            'low_resolution_pdf_url': 'Book LR',
            'webview_link': 'CNX',
            'concept_coach_link': 'Concept Coach'
        };

        for (const slug of Object.keys(bookData)) {
            const book = bookData[slug];

            for (const url of Object.keys(urlMarker)) {
                this.sourceByUrl[url] = `${book.title} ${urlMarker[url]}`;
            }
        }
    }

    lookupUrl(selectedUrl) {
        if (selectedUrl in this.sourceByUrl) {
            return this.sourceByUrl[selectedUrl];
        }

        const found = Object.keys(this.sourceByUrl)
            .find(url => selectedUrl.localCompare(url) === 0);

        return found ? this.sourceByUrl[found] : '';
    }

    fetchBooks() {
        /* eslint arrow-parens: 0 */
        (async () => {
            try {
                const response = await fetch(`${settings.apiOrigin}/api/books`);
                const data = await response.json();

                this.buildUrlLookupTable(data.books);
            } catch (e) {
                console.log(e);
            }
        })();

        /* eslint arrow-parens: 0 */
        (async () => {
            try {
                const response = await fetch(`${settings.apiOrigin}/api/v2/pages/?type=books.Book&fields`+
                  '=title,book_student_resources,book_faculty_resources,book_allies');
                const bookFields = await response.json();

                this.buildResourceLookupTable(bookFields.items);
            } catch (e) {
                console.log(e);
            }
        })();
    }

    fetchPartners() {
        /* eslint arrow-parens: 0 */
        (async () => {
            try {
                const response = await fetch(`${settings.apiOrigin}/api/v2/pages/?type=books.Book&fields`+
                  '=title,book_allies');
                const data = await response.json();

                buildPartnerLookupTable(data);
            } catch (e) {
                console.log(e);
            }
        })();
    }

    buildResourceLookupTable(resourceItems) {
        const resourceMarker = {
            'book_student_resources': 'Student',
            'book_faculty_resources': 'Faculty'
        };

        for (const item of resourceItems) {
            for (const resourceBranch of Object.keys(resourceMarker)) {
                const marker = resourceMarker[resourceBranch];

                for (const resource of item.book[resourceBranch]) {
                    this.sourceByUrl[resource.link_document_url] = `${item.title} ${marker}`;
                }
            }
        }
    }

    buildPartnerLookupTable(partnerItems) {
        for (const item of partnerItems) {
            for (const ally of item.book_allies) {
                const url = ally.book_link_url;

                this.sourceByUrl[url] = ally.ally_heading;
            }
        }
    }

    [SETUP_GA]() {
        this.data = {};
        this.sourceByUrl = {};
        this.fetchBooks();
        this.fetchPartners();
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
