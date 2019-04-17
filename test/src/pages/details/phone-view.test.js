import PhoneView from '~/pages/details/phone-view/phone-view';
import details from '../../data/details-biology-2e.js';
import {transformData} from '~/helpers/controller/cms-mixin';
import getCompCopyDialogProps from '~/pages/details/comp-copy-dialog-props';

const pageData = transformData(details);
const userStatusPromise = Promise.resolve({});
const pvData = {
    bookInfo: pageData,
    bookTitle: pageData.title,
    bookState: pageData.book_state,
    detailsTabData: {
        allSenior: [],
        allNonsenior: []
    },
    errataContent: pageData.errata_content,
    instructorResources: {
        freeResources: pageData.book_faculty_resources,
        paidResources: pageData.book_allies
    },
    slug: pageData.slug,
    salesforceAbbreviation: pageData.salesforce_abbreviation,
    studentResources: pageData.book_student_resources,
    tableOfContents: pageData.table_of_contents,
    userStatusPromise,
    webviewLink: pageData.webview_link,
    compCopyDialogProps: getCompCopyDialogProps(
        {
            title: pageData.title,
            coverUrl: pageData.cover_url,
            prompt: (pageData.comp_copy_content || ['Request your complimentary iBooks download'])[0]
        },
        userStatusPromise
    )
};

describe('details/phone-view', () => {
    it ('has a Polish title for a Polish book', () => {
        const p = new PhoneView(Object.assign({polish: true}, pvData));
        const accItem = p.el.querySelector('.accordion-item .label');

        expect(p).toBeTruthy();
        expect(accItem.textContent).toContain('Szczegóły');
    });
    it ('has an English title for an English book', () => {
        const p = new PhoneView(Object.assign({polish: false}, pvData));
        const accItem = p.el.querySelector('.accordion-item .label');

        expect(p).toBeTruthy();
        expect(accItem.textContent).toBe('Book details');
    });
});
