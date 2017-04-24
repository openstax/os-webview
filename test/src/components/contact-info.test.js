import 'babel-polyfill';
import ContactInfo from '~/components/contact-info/contact-info';
jest.mock('~/helpers/controller/managed-component');

describe('ContactInfo', () => {
    const p = new ContactInfo();

    it('initializes', () => {
        expect(p).toBeTruthy();
    });
});
