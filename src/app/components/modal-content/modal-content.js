import {Controller} from 'superb.js';
import css from './modal-content.css';
import shellBus from '~/components/shell/shell-bus';

export default class ModalContent extends Controller {

    /**
     * Provides a background overlay that covers the page
     * so that only the content is clearly visible and centered
     */
    init(content) {
        this.content = content;
        this.view = {
            tag: 'modal-content',
            classes: ['page-overlay']
        };
        this.css = css;
    }

    template() {
    }

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
