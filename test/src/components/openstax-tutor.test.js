import Tutor from '~/pages/openstax-tutor/openstax-tutor';

describe('Tutor', () => {
    const p = new Tutor();

    it('creates', () => {
        expect(p).toBeTruthy();
        console.log(p.el.innerHTML);
    });
});
