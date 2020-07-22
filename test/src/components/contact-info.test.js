import {makeMountRender} from '../../helpers/jsx-test-utils.jsx';
import ContactInfo from '~/components/contact-info/contact-info';

describe('ContactInfo', () => {
    const validatorRef = {};
    const props = {validatorRef};

    let wrapper;

    beforeEach((done) => {
        wrapper = makeMountRender(ContactInfo, props)();

        setTimeout(() => {
            wrapper.update();
            done();
        }, 10);
    });

    it('creates', () => {
        expect(validatorRef).toHaveProperty('current');
    });
    it('validates schools', () => {
        const schoolInput = wrapper.find({name: 'company'});

        expect(validatorRef.current()).toBe(false);
        schoolInput.simulate('change', { value: 'Rice'});
        expect(wrapper.find('#popupMessage')).toHaveLength(1);
    });
});
