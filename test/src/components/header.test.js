import header from '~/components/shell/header/header';

function clickEvent() {
    return new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
}

function clickLink(link) {
    link.dispatchEvent(clickEvent());
}

describe('Header', () => {

    it('creates', () => {
        expect(header).toBeTruthy();
    });

    it('can be pinned and unpinned', () => {
        header.pin();
        expect(header.isPinned()).toBe(true);
        header.reset();
        expect(header.isPinned()).toBe(false);
    });

    it('can get height', () => {
        const h = header.height;

        expect(header.height).toBe(0);
    });

    it('updates header styles', () => {

        header.updateHeaderStyle();
    });

    it('opens dropdowns', () => {
        const link = header.el.querySelector('.dropdown > a');

        clickLink(link);
    });

    it('closes dropdowns', () => {
        clickLink(document.body);
    });

    it('toggle fullscreen', () => {
        const link = header.el.querySelector('.expand');

        clickLink(link);
    });

    const mainMenu = header.mainMenu;

    it('mainMenu handles redirect click', () => {
        const link = mainMenu.el.querySelector('a[data-set-redirect]');

        clickLink(link);
    });

    it('mainMenu shows training wheel', () => {
        mainMenu.model.user.username = 'Jest';
        mainMenu.model.user.groups.push('Tutor');
        mainMenu.update();

        const link = mainMenu.el.querySelector('.tutor-menu-item a');
        const event = new Event('focusout');
        window.requestAnimationFrame = () => null;

        mainMenu.showTutorTrainingWheel();
        if (link) { link.dispatchEvent(event); }
        else { console.log('No tutor menu item', mainMenu.el.innerHTML); }
    });

    it('mainMenu hides training wheel', () => {
        mainMenu.putAwayTrainingWheel();
    });

});
