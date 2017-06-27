import FormSelect from '~/components/form-select/form-select';

describe('FormSelect', () => {
    const validationMessage = () => '';
    const p = new FormSelect({
        validationMessage
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
        expect(p.proxyWidget.select.options.length).toBe(0);
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
        const e = new Event('click');

        Object.defineProperty(e, 'target', p.proxyWidget.el);
        p.proxyWidget.toggleDropdown(e);
    });
});
