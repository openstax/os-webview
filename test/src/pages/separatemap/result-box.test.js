import ResultBox from '~/pages/separatemap/search-box/result-box/result-box';
import {clickElement} from '../../../test-utils';

describe('ResultBox', () => {
    const instance = new ResultBox({
        model: {
            name: 'Institution Name',
            location: 'City, State',
            savingsThisYear: '$1,234',
            savingsTotal: '$5,678',
            isOpen: false,
            testimonial: {
                text: 'Good stuff',
                name: 'Some Body',
                position: 'Chief Example'
            }
        },
        info: {pk: 5}
    });
    const getSchoolDetails = () => instance.el.querySelector('.school-details');

    it('creates', () => {
        expect(instance).toBeTruthy();
        expect(getSchoolDetails()).toBeNull();
    });

    it('opens on click of toggle', () => {
        const t = instance.el.querySelector('.toggle-details');

        expect(instance.model.isOpen).toBeFalsy();
        clickElement(t);
        expect(instance.model.isOpen).toBe(true);
        expect(getSchoolDetails()).toBeTruthy();
    });
});
