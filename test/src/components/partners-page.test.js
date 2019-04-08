import _nothing from '../../helpers/fetch-mocker';
import Partners from '~/pages/partners/partners';
import CategorySelector from '~/components/category-selector/category-selector';
import {clickElement} from '../../test-utils';

class TestPartners extends Partners {
    init(...args) {
        super.init(...args);

        this._testPromises = {
            dataLoaded: new Promise((resolve) => {
                this._dataResolver = resolve;
            }),
            pageLoaded: new Promise((resolve) => {
                this._pageResolver = resolve;
            })
        };
    }

    onDataLoaded() {
        super.onDataLoaded();
        this._dataResolver(this.pageData);
    }

    onLoaded() {
        super.onLoaded();
        this._pageResolver();
    }
}

describe('Partners Page', () => {
    beforeEach(function () {
        window.history.replaceState({
            length: 3,
            scrollRestoration: 'manual',
            state: {
                filter: 'view-all',
                path: '/partners',
                x: 0,
                y: 0
            }
        }, 'MOCK');
    });

    const p = new TestPartners();

    it('creates', () => {
        expect(p).toBeTruthy();

        return Promise.all([p._testPromises.dataLoaded, p._testPromises.pageLoaded]).then(() => {
            const iconViewer = p.partnerViewer.iconViewer;
            const categories = CategorySelector.categories;
            const currentCategory = p.categoryFromPath();
            const logoCount = iconViewer.el.querySelectorAll('.logo').length;

            expect(iconViewer).toBeTruthy();
            expect(p.categoryFromPath()).toBe('view-all');
            expect(logoCount).toBe(39);
        });
    });
    const expectedNumbers = {
            'view-all': 39,
            math: 18,
            science: 26,
            humanities: 11,
            'social-sciences': 19,
            business: 0,
            ap: 6
    };
    it('selects each category', () => {
        const buttons = Array.from(p.el.querySelectorAll('.filter-button'));
        const iconViewer = p.partnerViewer.iconViewer;
        const blurbViewer = p.partnerViewer.blurbViewer;
        const promises = buttons.map((b) => {
            new Promise((resolve) => {
                p.categorySelector.on('change', resolve, 'once');
                clickElement(b);
            }).then((b) => {
                const logoCount = Array.from(iconViewer.el.querySelectorAll('.logo')).length;

                expect(logoCount).toBe(expectedNumbers[b]);
            });
        });

        return Promise.all(promises);
    });
    it('has corresponding logos and paragraphs', () => {
        Array.from(p.el.querySelectorAll('a.logo-text')).forEach((t) => {
            const href = t.getAttribute('href');
            const targetParagraph = p.el.querySelector(href);

            expect(targetParagraph).toBeTruthy();
        });
    });
});
