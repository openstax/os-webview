import FormSelect from '~/components/form-select/form-select';
import {clickElement, doKeyDown} from '../../test-utils';

describe('FormSelect', () => {
    const validationMessage = () => '';
    const p = new FormSelect({
        validationMessage,
        options: [
            {label: 'None', value: ''},
            {label: 'Online homework partners', value: 'Online homework partners'},
            {label: 'Adaptive courseware partners', value: 'Adaptive courseware partners'},
            {label: 'Customization tool partners', value: 'Customization tool partners'}
        ]
    });
    const ms = new FormSelect({
        name: '00NU0000005VmTu',
        label: 'Which technology are you using with your book?',
        instructions: 'You may select more than one.',
        multiple: true,
        validationMessage
    });

    it('creates single and multi', () => {
        expect(p).toBeTruthy();
        expect(ms).toBeTruthy();
    });

    it('can set options', () => {
        expect(p.proxyWidget.select.options.length).toBe(4);
        p.setOptions([
            {
                value: '1',
                label: 'one',
                selected: true
            }
        ]);
        expect(p.proxyWidget.select.options.length).toBe(1);
    });

    it('can call select methods', () => {
        p.proxyWidget.allowPageScrolling();
        expect(p).toBeTruthy();
    });

    it('handles click event', () => {
        const selectEl = p.proxyWidget.el;
        const optionsEl = selectEl.querySelector('.options');

        clickElement(selectEl);
        expect(optionsEl.classList.contains('open')).toBe(true);
        expect(p.proxyWidget.model.open).toBe(true);
    });

    it('keyboard-selects', () => {
        const selectEl = p.proxyWidget.el;

        doKeyDown(selectEl, 'ArrowDown');
        // console.log('Active Item:', p.proxyWidget.model.activeItem, p.proxyWidget.activeIndex);
        doKeyDown(selectEl, 'ArrowDown');
        // console.log('Active Item:', p.proxyWidget.model.activeItem, p.proxyWidget.activeIndex);
        // console.log('Active?', p.proxyWidget.el.querySelector('.option.active'));
        doKeyDown(p.proxyWidget.el.querySelector('.option.active'), 'Escape');
        // console.log('Selected?', p.proxyWidget.model.selected);
    });
});
