import '../../helpers/fetch-mocker';
import header from '~/components/shell/header/header';
import {clickElement} from '../../test-utils';

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

        clickElement(link);
    });

    it('closes dropdowns', () => {
        clickElement(document.body);
    });

    it('toggle fullscreen', () => {
        const link = header.el.querySelector('.expand');

        clickElement(link);
    });

    const mainMenu = header.mainMenu;

    it('mainMenu shows training wheel', () => {
        mainMenu.model.user.username = 'Jest';
        mainMenu.model.user.groups.push('Tutor');
        mainMenu.update();

        const link = mainMenu.el.querySelector('[href*="tutor.openstax"]');
        const event = new Event('focusout');
        window.requestAnimationFrame = () => null;

        mainMenu.showTutorTrainingWheel();
        if (link) { link.dispatchEvent(event); }
        else { console.info('No tutor menu item'); }
    });

    it('mainMenu hides training wheel', () => {
        mainMenu.putAwayTrainingWheel();
    });

});
