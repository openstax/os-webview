import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import css from './modal-content.css';
import shellBus from '~/components/shell/shell-bus';

export default class ModalContent extends Controller {

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
        shellBus.emit('with-sticky');
        this.regions.self.append(this.content);
    }

    onClose() {
        shellBus.emit('no-sticky');
    }

}
