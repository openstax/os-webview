import {Controller} from 'superb.js';
import $ from '~/helpers/$';

export default class ModalContent extends Controller {

    init(content) {
        this.template = () => '';
        this.content = content;
        this.view = {
            tag: 'modal-content',
            classes: ['page-overlay']
        };
        this.css = '/app/components/modal-content/modal-content.css';
    }

    onLoaded() {
        document.getElementById('main').classList.add('with-overlay');
        this.regions.self.append(this.content);
    }

    onClose() {
        document.getElementById('main').classList.remove('with-overlay');
    }

}
