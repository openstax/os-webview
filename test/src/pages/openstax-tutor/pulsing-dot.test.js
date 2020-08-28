import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';
import PulsingDot from '~/pages/openstax-tutor/pulsing-dot/pulsing-dot';

describe('PulsingDot', () => {
    const wrapper = makeMountRender(PulsingDot)();

    it('starts pulsing', () => {
        const stopped = wrapper.find('.stopped');

        expect(stopped.length).toBe(0);
    });
    it('stops when you click it', () => {
        wrapper.find('.pulsing-dot').simulate('click');

        const stopped = wrapper.find('.stopped');

        expect(stopped.length).toBe(1);
    });
});
