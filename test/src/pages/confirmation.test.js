import '../../helpers/fetch-mocker';
import Confirmation from '~/pages/confirmation/confirmation';

const referrers = {
    contact: 'Thanks for contacting us',
    'errata?id=7199': 'Thanks for your help!',
    interest: 'Thank you'
};
describe('Confirmation', () => {
    Reflect.ownKeys(referrers).forEach((ref) => {
        it(`does ${ref} thanks`, () => {
            window.history.pushState({}, 'confirmation', `/confirmation/${ref}`);
            const instance = new Confirmation();
            const h1 = instance.el.querySelector('h1');

            expect(h1.textContent).toBe(referrers[ref]);
        });
    });
});
