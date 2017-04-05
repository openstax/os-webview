import NotFound from '~/pages/404/404';

describe('404', () => {
    it ('can instantiate 404 page', () => {
        const p = new NotFound();
    });
    test('has three classes', () => {
        const p = new NotFound();

        expect(p.el.classList.length).toBe(3);
    });
});
