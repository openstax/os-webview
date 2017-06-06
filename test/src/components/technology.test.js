import Technology from '~/pages/technology/technology';

describe('Technology', () => {
    const p = new Technology();

    it('creates', () => {
        expect(p).toBeTruthy();
        console.log(p.el.innerHTML);
    });
});
