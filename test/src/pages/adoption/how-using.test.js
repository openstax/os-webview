import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';
import HowUsing from '~/pages/adoption/how-using/how-using';

describe('HowUsing', () => {

    let wrapper;

    beforeEach((done) => {
        const props = {
            selectedBooks: [],
            selectedBooks: [{
                text: 'First Book',
                value: 'first-book'
            }]
        };
        wrapper = makeMountRender(HowUsing, props)();
        setTimeout(() => {
            wrapper.update();
            done();
        }, 10);
    });

    it('creates', () => {
        expect(wrapper.text()).toContain('How are you using First Book?')
        const radios = wrapper.find('[type="radio"]');

        expect(radios).toHaveLength(2);
    });
});
