import SearchBox from '~/pages/separatemap/search-box/search-box';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';

describe('SearchBox', () => {
    const factory = makeMountRender(SearchBox, {
        minimized: false
    });
    const wrapper = factory();
    const minimizedWrapper = factory({minimized: true});

    it('handles being unminimized', () => {
        const topBox = wrapper.find('.top-box.minimized');

        expect(topBox).toHaveLength(0);
    });
    it('handles being minimized', () => {
        const topBox = minimizedWrapper.find('.top-box.minimized');

        expect(topBox).toHaveLength(1);
    });
});
