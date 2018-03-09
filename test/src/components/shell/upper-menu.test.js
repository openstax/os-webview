import UpperMenu from '~/components/shell/header/upper-menu/upper-menu';

describe('UpperMenu', () => {
    const p = new UpperMenu();

    it('creates', () => {
        expect(p.el.innerHTML).toBeTruthy();
    });
    it('matches snapshot', () => {
        console.log('To update snapshot: node_modules/.bin/jest --updateSnapshot --testNamePattern=UpperMenu');
        expect(p.el.innerHTML).toMatchSnapshot();
    });
});
