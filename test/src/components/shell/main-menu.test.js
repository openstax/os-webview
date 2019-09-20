import MainMenu from '~/components/shell/header/main-menu/main-menu';

describe('main-menu', () => {
    const m = new MainMenu();

    it('creates', () => {
        expect(m).toBeTruthy();
    });
});
