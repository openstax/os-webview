import '../../helpers/fetch-mocker';
import BookstoreSuppliers from '~/pages/bookstore-suppliers/bookstore-suppliers';
import instanceReady from '../../helpers/instance-ready';

describe('BookstoreSuppliers', () => {
    it('creates', () => {
        const {instance, ready} = instanceReady(BookstoreSuppliers);

        return ready.then(() => {
            expect(instance).toBeTruthy();
            expect(instance.model.buttonUrl).toBeTruthy();
            const mainEl = instance.el.querySelector('.main-content');

            expect(mainEl).toBeTruthy();
        });
    });
});
