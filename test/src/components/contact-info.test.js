import ContactInfo from '~/components/contact-info/contact-info';

describe('ContactInfo', () => {
    const p = new ContactInfo({
        validationMessage: () => 'this is the validationMessage'
    });
    const schoolUrl = p.el.querySelector('[data-id="schoolUrl"] input');

    it('initializes', () => {
        expect(p).toBeTruthy();
    });
});
