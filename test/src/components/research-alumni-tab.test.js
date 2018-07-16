import AlumniTab from '~/pages/research/alumni-tab/alumni-tab';

describe('Research Alumni Tab', () => {
    const p = new AlumniTab([{
      name: 'Name Field',
      title: 'Title field has more text'
    }]);

    it('creates', () => {
        expect(p).toBeTruthy();
        const n = p.el.querySelector('.name');
        const t = p.el.querySelector('.description');

        expect(n.textContent).toBe('Name Field');
        expect(t.textContent).toBe('Title field has more text');
    });
});
