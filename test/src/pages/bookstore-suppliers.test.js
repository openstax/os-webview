import {BookstorePageLoader} from '~/pages/bookstore-suppliers/bookstore-suppliers';
import {makeMountRender, snapshotify} from '../../helpers/jsx-test-utils.jsx';

describe('BookstoreSuppliers', () => {
    it('matches snapshot', () => {
        const wrapper = makeMountRender(BookstorePageLoader, {})()

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(expect(snapshotify(wrapper)).toMatchSnapshot());
            }, 0);
        });
    });
});
