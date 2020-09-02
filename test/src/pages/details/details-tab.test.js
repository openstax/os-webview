import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';
import DetailsTab from '~/pages/details/desktop-view/details-tab/details-tab.js';

const polishData = {
    polish: true,
    authors: [],
    license_name: 'cc by',
    license_text: 'Polish license text',
    title: 'fizyka',
    bookInfo: {
        webview_link: 'https://cnx.org/contents/185cbf87-c72e-48f5-b51e-f14f21b5eabd;',
        table_of_contents: {
                'shortId': 'jVCgr5SL@15.3'
        },
        slug: 'books/fyzyka'
    },
    errataContent: {content: []},
    webviewRexLink: '',
    bookstoreContent: []
};

const isbns = {};
['print', 'digital', 'ibook'].forEach((t) => {
    isbns[`${t}_isbn_10`] = '1234-56-7890';
    isbns[`${t}_isbn_13`] = '123-45-678-90123';
});
const englishData = {
    polish: false,
    authors: [],
    bookState: 'live',
    formattedPublishDate: 'Dec 05, 2017',
    license_name: 'cc by',
    ibook_volume_2_isbn_13: '000-000-000-0000',
    title: 'Text Title',
    bookInfo: {
        webview_link: 'https://cnx.org/contents/185cbf87-c72e-48f5-b51e-f14f21b5eabd;',
        table_of_contents: {
                'shortId': 'jVCgr5SL@15.3'
        },
        slug: 'books/english-slug'
    }
};

describe('details/details-tab for Polish', () => {
    const wrapper = makeMountRender(DetailsTab, {model: polishData})();

    expect(wrapper.find('.loc-pub-date')).toHaveLength(2);
    console.log(wrapper.find('.loc-pub-date').at(0).html());
    expect(wrapper.find('.loc-print-isbn,.loc-digital-isbn,.loc-ibook-isbn')).toHaveLength(0);
    expect(wrapper.text()).toContain('Korzystasz');
});

// describe('details/details-tab for English', () => {
//     const p = new DetailsTab(Object.assign({}, englishData, isbns));
//
//     it('has a publish date', () => {
//         const el = p.el.querySelector('.loc-pub-date');
//
//         expect(el.textContent).toContain(englishData.formattedPublishDate);
//     });
//     it('has ISBN sections', () => {
//         const isbnSections = p.el.querySelectorAll('.loc-print-isbn,.loc-digital-isbn,.loc-ibook-isbn');
//
//         expect(isbnSections.length).toBe(4);
//     });
//     it('has an errata section', () => {
//         const errataEl = p.el.querySelector('.loc-errata');
//
//         expect(errataEl).toBeTruthy();
//     });
// });
//
// describe('non-live book', () => {
//     const p = new DetailsTab(Object.assign({}, englishData, {bookState: 'archived'}));
//     it('has no errata section', () => {
//         const errataEl = p.el.querySelector('.loc-errata');
//
//         expect(errataEl).toBeNull();
//     });
// });
