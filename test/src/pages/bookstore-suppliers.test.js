import {BookstorePage} from '~/pages/bookstore-suppliers/bookstore-suppliers';
import {makeMountRender, snapshotify} from '../../helpers/jsx-test-utils.jsx';
import pageData from '../data/print-order';

describe('BookstoreSuppliers', () => {
    it('matches snapshot', () => {
        const wrapper = makeMountRender(BookstorePage, {data: pageData})();

        expect(snapshotify(wrapper)).toMatchSnapshot();
    });
});
