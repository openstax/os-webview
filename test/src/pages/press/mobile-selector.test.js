import MobileSelector from '~/pages/press/mobile-selector/mobile-selector';
import {makeMountRender, snapshotify} from '../../../helpers/jsx-test-utils.jsx';

describe('press/MobileSelector', () => {
    it('opens, changes values, and closes', () => {
        let mobileSelection = 'Press releases';
        const values = [
            'Press releases',
            'News mentions',
            'Press inquiries',
            'Booking'
        ];
        const wrapper = makeMountRender(MobileSelector, {
            selectedValue: mobileSelection,
            values,
            onChange(newValue) {
                mobileSelection = newValue;
            }
        })();

        expect(wrapper.find('[role="menuitem"]')).toHaveLength(0);
        wrapper.find('.selector-button').simulate('click');
        expect(wrapper.find('[role="menuitem"]')).toHaveLength(values.length);
        wrapper.find('[role="menuitem"]:not(.selected)').at(0).simulate('click');
        expect(mobileSelection).toBe(values[1]);
        expect(wrapper.find('[role="menuitem"]')).toHaveLength(0);
    });
});
