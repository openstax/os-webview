import _nothing from '../../helpers/fetch-mocker';
import Partners from '~/pages/partners/partners';
import CategorySelector from '~/components/category-selector/category-selector';

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
            expect(p.partnerViewer.iconViewer).toBeTruthy();
            console.log('Category (from path)', p.categoryFromPath());
            console.log('*** icon viewer HTML', p.partnerViewer.iconViewer.el.innerHTML);
            console.log('Categories:', CategorySelector.categories);
        });
    });
});
