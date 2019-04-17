import DetailsTab from '~/pages/details/details-tab/details-tab';

const polishData = {
    polish: true,
    allSenior: [
        {
            name: 'First Author',
            university: 'Senior University'
        }
    ],
    allNonsenior: [
        {
            name: 'Nonsenior Author',
            university: 'Junior College'
        }
    ],
    license_name: 'cc by',
    license_text: 'Polish license text',
    title: 'fizyka'
};

const isbns = {};
['print', 'digital', 'ibook'].forEach((t) => {
    isbns[`${t}_isbn_10`] = '1234-56-7890';
    isbns[`${t}_isbn_13`] = '123-45-678-90123';
});
const englishData = {
    polish: false,
    allSenior: [
        {
            name: 'First Author',
            university: 'Senior University'
        }
    ],
    allNonsenior: [
        {
            name: 'Nonsenior Author',
            university: 'Junior College'
        }
    ],
    bookState: 'live',
    formattedPublishDate: 'Dec 05, 2017',
    license_name: 'cc by',
    ibook_volume_2_isbn_13: '000-000-000-0000',
    title: 'Text Title'
};

describe('details/details-tab for Polish', () => {
    const p = new DetailsTab(polishData);

    expect(p).toBeTruthy();
    it('has no publish date', () => {
        const el = p.el.querySelector('.loc-pub-date');

        expect(el).toBeNull();
    });
    it('has no ISBN sections', () => {
        const isbnSections = p.el.querySelectorAll('.loc-print-isbn,.loc-digital-isbn,.loc-ibook-isbn');

        expect(isbnSections.length).toBe(0);
    });
    it('has Polish text', () => {
        expect(p.el.textContent).toContain('Korzystasz');
    });
});

describe('details/details-tab for English', () => {
    const p = new DetailsTab(Object.assign({}, englishData, isbns));

    it('has a publish date', () => {
        const el = p.el.querySelector('.loc-pub-date');

        expect(el.textContent).toContain(englishData.formattedPublishDate);
    });
    it('has ISBN sections', () => {
        const isbnSections = p.el.querySelectorAll('.loc-print-isbn,.loc-digital-isbn,.loc-ibook-isbn');

        expect(isbnSections.length).toBe(4);
    });
    it('has an errata section', () => {
        const errataEl = p.el.querySelector('.loc-errata');

        expect(errataEl).toBeTruthy();
    });
});

describe('non-live book', () => {
    const p = new DetailsTab(Object.assign({}, englishData, {bookState: 'archived'}));
    it('has no errata section', () => {
        const errataEl = p.el.querySelector('.loc-errata');

        expect(errataEl).toBeNull();
    });
});
