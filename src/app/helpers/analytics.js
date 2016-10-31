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

    record(href) {
        if (linkHelper.isExternal(href)) {
            this.handleExternalLink(href);
        }

        if (linkHelper.isPDF(href)) {
            const bookName = this.getBookName(href);

            this.sendEvent({
                eventCategory: 'PDF '.concat(bookName),
                eventAction: 'download',
                eventLabel: href,
                location: location.href
            });
        }

        if (linkHelper.isZIP(href)) {
            const bookName = this.getBookName(href);

            this.sendEvent({
                eventCategory: 'ZIP '.concat(bookName),
                eventAction: 'download',
                eventLabel: href,
                location: location.href
            });
        }

        if (linkHelper.isTXT(href)) {
            const bookName = this.getBookName(href);

            this.sendEvent({
                eventCategory: 'TXT '.concat(bookName),
                eventAction: 'download',
                eventLabel: href,
                location: location.href
            });
        }
    }

    handleExternalLink(href) {
        if (linkHelper.isCNX(href)) {
            const cnxBook = this.getCNXBookName(href);

            this.sendEvent({
                eventCategory: 'CNX '.concat(cnxBook),
                eventAction: 'open',
                eventLabel: href,
                location: location.href
            });
        } else if (linkHelper.isCloudFront(href)) {
            return;
        } else {
            const partner = this.getPartner(href);

            if (partner !== '') {
                this.sendEvent({
                    eventCategory: 'Partner '.concat(partner),
                    eventAction: 'open',
                    eventLabel: href,
                    location: location.href
                });
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

    fetchBooks() {
        /* eslint arrow-parens: 0 */
        (async () => {
            try {
                const response = await fetch(`${settings.apiOrigin}/api/books`);
                const data = await response.json();

                this.data.books = data.books;
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

                this.data.resources = bookFields.items;
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

                this.data.partners = data;
            } catch (e) {
                console.log(e);
            }
        })();
    }

    getBookName(pdfUrl) {
        let bookTitle = '';

        bookTitle = this.checkBookPDF(pdfUrl);

        if (bookTitle === '') {
            bookTitle = this.checkFacultyResources(pdfUrl);
            if (bookTitle === '') {
                bookTitle = this.checkStudentResources(pdfUrl);
            }
        }
        return bookTitle;
    }

    checkBookPDF(pdfUrl) {
        for (const slug of Object.keys(this.data.books)) {
            const book = this.data.books[slug];
            const hrUrl = book.high_resolution_pdf_url;
            const lrUrl = book.low_resolution_pdf_url;
            const hrResults = pdfUrl.localeCompare(hrUrl);
            const lrResults = pdfUrl.localeCompare(lrUrl);

            if (hrResults === 0) {
                return book.title.concat(' Book HR');
            }

            if (lrResults === 0) {
                return book.title.concat(' Book LR');
            }
        }

        return '';
    }

    checkStudentResources(href) {
        for (const item of this.data.resources) {
            for (const resource of item.book_student_resources) {
                const url = resource.link_document_url;
                const urlResults = href.localeCompare(url);

                if (urlResults === 0) {
                    return item.title.concat(' Student');
                    break;
                }
            }
        }

        return '';
    }

    checkFacultyResources(href) {
        for (const item of this.data.resources) {
            for (const resource of item.book_faculty_resources) {
                const url = resource.link_document_url;
                const urlResults = href.localeCompare(url);

                if (urlResults === 0) {
                    return item.title.concat(' Faculty');
                    break;
                }
            }
        }

        return '';
    }

    getPartner(partnerUrl) {
        for (const item of this.data.partners.items) {
            for (const ally of item.book_allies) {
                const partner = ally.ally_heading;
                const url = ally.book_link_url;
                const urlResults = partnerUrl.localeCompare(url);

                if (urlResults === 0) {
                    return partner;
                    break;
                }
            }
        }
        return '';
    }

    getCNXBookName(cnxUrl) {
        for (const slug of Object.keys(this.data.books)) {
            const book = this.data.books[slug];
            const wvUrl = book.webview_link;
            const ccUrl = book.concept_coach_link;
            const cnxResults = cnxUrl.localeCompare(wvUrl);
            const ccResults = cnxUrl.localeCompare(ccUrl);

            if (cnxResults === 0) {
                return book.title;
            }

            if (ccResults === 0) {
                return book.title.concat(' Concept Coach');
            }
        }

        return '';
    }

    [SETUP_GA]() {
        this.data = {};
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
