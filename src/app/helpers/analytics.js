import booksPromise from '~/models/books';
import settings from 'settings';
import linkHelper from '~/helpers/link';
import {accountsModel} from '~/models/usermodel';

const RELATIVE_TO_ROOT = /^\//;
const SETUP_GA = Symbol();
const waitForAnalytics = new Promise((resolve, reject) => {
    let triesLeft = 10;
    const tryInterval = setInterval(() => {
        if (typeof window.ga === 'function') {
            clearInterval(tryInterval);
            resolve(true);
        } else if (triesLeft > 0) {
            --triesLeft;
        } else {
            clearInterval(tryInterval);
            reject('Failed to load Google Analytics');
        }
    }, 500);
});

class Analytics {

    constructor() {
        this.start();
    }

    start() {
        this[SETUP_GA]();
    }

    setUser(userId) {
        window.ga('set', 'userid', userId);
    }

    send(fields) {
        waitForAnalytics.then(
            () => {
                window.ga('send', fields);
                if (settings.analyticsID2) {
                    window.ga('ga2.send', fields);
                }
            },
            (problem) => {
                console.warn(problem);
            }
        );
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

    sendPageEvent(category, action, label) {
        const eventPacket = {
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            location: window.location.href
        };

        this.sendEvent(eventPacket);
    }

    sendUrlEvent(category, href, action = 'download') {
        const source = this.lookupUrl(href) || 'unknown';

        this.sendPageEvent(
            `${category} ${source}`,
            action,
            href
        );
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

        resourceItems.forEach((item) => {
            Object.keys(resourceMarker).forEach((resourceBranch) => {
                const marker = resourceMarker[resourceBranch];

                item[resourceBranch].forEach((resource) => {
                    this.sourceByUrl[resource.link_document_url] = `${item.title} ${marker}`;
                });
            });
            item.book_allies.forEach((ally) => {
                const url = ally.book_link_url;

                this.sourceByUrl[url] = ally.ally_heading;
            });
        });
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
                const books = await booksPromise;

                this.addBooksToLookupTable(books);
            } catch (e) {
                console.log(e);
            }
        })();

        /* eslint arrow-parens: 0 */
        (async () => {
            try {
                const response = await fetch(
                    `${settings.apiOrigin}${settings.apiPrefix}/v2/pages/?type=books.Book&fields`+
                    '=title,book_student_resources,book_faculty_resources,book_allies&limit=250'
                );
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
                q: [['create', settings.analyticsID, 'auto']],
                l: Date.now()
            };
            if (settings.analyticsID2) {
                window.ga.q.push(['create', settings.analyticsID2, 'auto', {name: 'ga2'}]);
            }
        } else {
            window.ga('create', settings.analyticsID, 'auto');
            if (settings.analyticsID2) {
                window.ga('create', settings.analyticsID2, 'auto', {name: 'ga2'});
            }
        }

        accountsModel.load().then((accountResponse) => {
            const role = accountResponse.self_reported_role;

            if (typeof role !== 'undefined') {
                window.ga('send', 'pageview', {dimension1: role, nonInteraction: true});
            }
        });

        document.addEventListener('submit', (e) => {
            if (typeof e.target !== 'object' || typeof e.target.action !== 'string') {
                return;
            }

            if (e.target.action.indexOf('https://webto.salesforce.com/') === 0) {
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
