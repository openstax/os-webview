import TestimonialForm from '~/pages/separatemap/testimonial-form/testimonial-form';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';

const formParameters = {
    email: 'e@mail.com',
    school: 'info.self_reported_school',
    firstName: 'Firstly',
    lastName: 'Namester',
    afterSubmit() {
        console.log('Aftersubmit fired');
    }
};

describe('Testimonial-form', () => {
    const wrapper = makeMountRender(TestimonialForm, formParameters)();

    it('initially hides textarea and submit', () => {
        const ta = wrapper.find('textarea');
        const submit = wrapper.find('[type="submit"]');

        expect(ta).toHaveLength(0);
        expect(submit).toHaveLength(0);
    });
});
