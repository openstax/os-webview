import BookCheckbox from '~/components/book-checkbox/book-checkbox';
import {clickElement, doKeyDown} from '../../test-utils';

describe('BookCheckbox', () => {
    const cb = new BookCheckbox(() => ({
        name: 'Partner_Interest__c',
        value: 'a_value',
        label: 'A Label',
        imageUrl: '//someImage/foo.jpg'
    }));

    it('handles click', () => {
        let clicked = false;

        expect(cb).toBeTruthy();
        cb.on('change', (c) => {
            clicked = c;
        }, 'once')
        clickElement(cb.el);
        expect(clicked).toBe(true);
    });

    it('handles enter keypress', () => {
        let selected = cb.checked = false;
        const target = cb.el.querySelector('.indicator');

        expect(target).toBeTruthy();
        cb.on('change', (c) => {
            selected = c;
        }, 'once');
        doKeyDown(target, 'Enter');
        expect(selected).toBe(true);
    });
});
