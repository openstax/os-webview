import TestimonialForm from '~/pages/separatemap/testimonial-form/testimonial-form';

const formParameters = {
    role: 'Instructor',
    email: 'e@mail.com',
    school: 'info.self_reported_school',
    firstName: 'Firstly',
    lastName: 'Namester'
};

describe('Testimonial-form', () => {
    const tf = new TestimonialForm(formParameters);

    it('creates', () => {
        expect(tf).toBeTruthy();
    });
    it('initially hides textarea and submit', () => {
        const ta = tf.el.querySelector('textarea');
        const submit = tf.el.querySelector('[type="submit"]');

        expect(ta).toBeFalsy();
        expect(submit).toBeFalsy();
    });
    it('shows textarea and submit when book is selected', () => {
        tf.book = 'college-algebra';
        tf.update();
        const ta = tf.el.querySelector('textarea');
        const submit = tf.el.querySelector('[type="submit"]');

        expect(ta).toBeTruthy();
        expect(submit).toBeTruthy();
    });
});
