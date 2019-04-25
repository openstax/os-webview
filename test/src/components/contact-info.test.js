import ContactInfo from '~/components/contact-info/contact-info';
import instanceReady from '../../helpers/instance-ready';

describe('ContactInfo', () => {
    const {instance:p, ready} = instanceReady(ContactInfo, {
        validationMessage: () => 'this is the validationMessage'
    });

    it('initializes', () => {
        return ready.then(() => {
            expect(p).toBeTruthy();
        });
    });
    it('catches invalid entries', () => {
        return ready.then(() => {
            expect(p.validate()).toBeTruthy();
            expect(p.validated).toBe(true);
        });
    });
    it('balks once on short school name', () => {
        return ready.then(() => {
            const popupMessageEl = () => p.el.querySelector('#popupMessage');
            const schoolInput = p.el.querySelector('[name="company"]');

            expect(popupMessageEl()).toBeFalsy();
            expect(schoolInput).toBeTruthy();
            schoolInput.value = 'Rice';
            expect(p.checkSchoolName()).toBe(true);
            expect(popupMessageEl()).toBeTruthy();
            expect(p.checkSchoolName()).toBe(false);
        })
    });
});
