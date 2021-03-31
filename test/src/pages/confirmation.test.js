import Confirmation from '~/pages/confirmation/confirmation';
import {makeMountRender} from '../../helpers/jsx-test-utils.jsx';

const referrers = {
    contact: 'Thanks for contacting us',
    'errata?id=7199': 'Thanks for your help!'
};
describe('Confirmation', () => {
    Reflect.ownKeys(referrers).forEach((ref) => {
        it(`does ${ref} thanks`, () => {
            window.history.pushState({}, 'confirmation', `/confirmation/${ref}`);
            const wrapper = makeMountRender(Confirmation, {})();
            const h1 = wrapper.find('h1');

            expect(h1.text()).toBe(referrers[ref]);
        });
    });
});
