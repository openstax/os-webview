import {TeamLoader} from '~/pages/team/team';
import {makeMountRender} from '../../helpers/jsx-test-utils.jsx';

describe('Team Page', () => {
    const wrapper = makeMountRender(TeamLoader, {})();

    it('creates', () => {
        expect(wrapper).toBeTruthy();
    });
    it('has a big chunk of content', () => {
        wrapper.update();
        expect(wrapper.html().length).toBeGreaterThan(500);
    });
});
