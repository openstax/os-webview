import PulsingDot from '~/pages/openstax-tutor/pulsing-dot/pulsing-dot';
import {clickElement} from '../../../test-utils';

describe('PulsingDot', () => {
    const p = new PulsingDot();

    it('starts pulsing', () => {
        expect(p.model.stopPulsing).toBe(false);
    });
    it('stops when you click it', () => {
        clickElement(p.el);
        expect(p.model.stopPulsing).toBe(true);
    });
});
