import ModalContent from '~/components/modal-content/modal-content';
import ResourceBox from '~/pages/details/resource-box/resource-box';
import shellBus from '~/components/shell/shell-bus';

describe('ModalContent', () => {

    it('sends "with-sticky" and "no-sticky" on attach and detatch', () => {

        const gotWithSticky = new Promise((resolve) => {
            shellBus.on('with-sticky', resolve, 'once');
        });
        const gotNoSticky = new Promise((resolve) => {
            shellBus.on('with-sticky', resolve, 'once');
        });

        const mc = new ModalContent(new ResourceBox({}));

        mc.detach();
        return Promise.all([gotWithSticky, gotNoSticky]).then(() => {
            return true;
        });
    });

});
