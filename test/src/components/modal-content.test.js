import ModalContent from '~/components/modal-content/modal-content';
import ResourceBox from '~/pages/details-new/resource-box/resource-box';

describe('ModalContent', () => {
    const main = document.createElement('div');

    main.id = 'main';
    document.body.appendChild(main);

    const mc = new ModalContent(new ResourceBox({}));

    it('adds and removes "with-overlay" class to main', () => {
        expect(main.classList).toContain('with-overlay');
        mc.detach();
        expect(main.classList).not.toContain('with-overlay');
    });

});
