import MobileSelector from '~/pages/press/mobile-selector/mobile-selector';
import {clickElement} from '../../../test-utils';

describe('press/MobileSelector', () => {
    it('opens, changes values, and closes', () => {
        let mobileSelection = 'Press releases';
        const instance = new MobileSelector(
            () => ({
                selectedValue: mobileSelection,
                values: [
                    'Press releases',
                    'News mentions',
                    'Press inquiries',
                    'Booking'
                ]
            }),
            (newValue) => {
                mobileSelection = newValue;
                instance.update();
            }
        );

        expect(instance).toBeTruthy();
        expect(instance.showingMenu).toBe(false);
        const sbEl = instance.el.querySelector('.selector-button');
        const queryOverlay = () => instance.el.querySelector('.fixed-overlay');

        expect(sbEl).toBeTruthy();
        expect(queryOverlay()).toBeFalsy();
        clickElement(sbEl);
        expect(queryOverlay()).toBeTruthy();
        expect(mobileSelection).toBe('Press releases');
        const lastItem = instance.el.querySelectorAll('[role="menuitem"]')[3];

        clickElement(lastItem);
        expect(mobileSelection).toBe('Booking');
        expect(queryOverlay()).toBeFalsy();
    });
});
