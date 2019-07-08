import ModalContent from '~/components/modal-content/modal-content';
import ResourceBox from '~/pages/details/resource-box/resource-box';
import shellBus from '~/components/shell/shell-bus';

describe('ModalContent', () => {

    it('creates', () => {

        const mc = new ModalContent(new ResourceBox({}));

        expect(mc).toBeTruthy();
        mc.detach();
    });

});
