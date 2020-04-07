import ModalContent from '~/components/modal-content/modal-content';
import Child from '~/components/a-component-template/a-component-template';

describe('ModalContent', () => {

    it('creates', () => {
        const mc = new ModalContent({
            content: new Child()
        });

        expect(mc).toBeTruthy();
        mc.detach();
    });

});
