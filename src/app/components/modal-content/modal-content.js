import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import css from './modal-content.css';

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
        document.getElementById('main').classList.add('with-overlay');
        this.regions.self.append(this.content);
    }

    onClose() {
        document.getElementById('main').classList.remove('with-overlay');
    }

}
