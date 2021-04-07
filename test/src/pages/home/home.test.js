import HomeLoader from '~/pages/home/home';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';

describe('homepage', () => {
    const wrapper = makeMountRender(HomeLoader, {})();

    it('creates', () => {
        expect(wrapper).toBeTruthy();
    });
    it('has a big chunk of content', () => {
        wrapper.update();
        expect(wrapper.html().length).toBeGreaterThan(500);
    });
});
