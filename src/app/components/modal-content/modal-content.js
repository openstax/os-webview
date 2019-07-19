import componentType from '~/helpers/controller/init-mixin';
import css from './modal-content.css';
import shellBus from '~/components/shell/shell-bus';

const spec = {
    css,
    view: {
        tag: 'modal-content',
        classes: ['page-overlay']
    }
};

export default class ModalContent extends componentType(spec) {

    /**
     * Provides a background overlay that covers the page
     * so that only the content is clearly visible and centered
     */
    onLoaded() {
        this.regions.self.append(this.content);
        shellBus.emit('with-modal');
    }

    hide() {
        shellBus.emit('no-modal');
    }

    onClose() {
        this.hide();
    }

}
