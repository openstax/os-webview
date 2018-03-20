import ContactInfo from '~/components/contact-info/contact-info';

describe('ContactInfo', () => {
    const p = new ContactInfo({
        validationMessage: () => 'this is the validationMessage'
    });
    const schoolUrl = p.el.querySelector('[data-id="schoolUrl"] input');

    it('initializes', () => {
        expect(p).toBeTruthy();
    });

    it('has a schoolUrl', () => {
        expect(schoolUrl).toBeTruthy();
    });

    it('pre-fills schoolUrl with http://', () => {
        expect(schoolUrl.value).toBe('http://');
    });

    it('Un-requires schoolUrl if selectedRole is homeschool', () => {
        expect(schoolUrl.required).toBe(true);
        p.props.selectedRole = 'Homeschool Instructor';
        p.update();
        expect(schoolUrl.required).toBe(false);
    })
});
