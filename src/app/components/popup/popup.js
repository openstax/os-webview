import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './popup.html';

export default class Popup extends Controller {

    init(message) {
        this.template = template;
        this.model = {
            message,
            show: true
        };
        this.view = {
            classes: ['page-overlay']
        };
        this.css = '/app/components/popup/popup.css';
    }

    onLoaded() {
        document.getElementById('main').classList.add('with-overlay');
    }

    onClose() {
        document.getElementById('main').classList.remove('with-overlay');
    }

    @on('click .dismiss')
    goAway() {
        this.detach();
    }

    @on('keydown')
    maybeGoAway(e) {
        e.preventDefault();
        if (['Enter', 'Escape', 'Spacebar'].includes(e.key)) {
            this.goAway();
        }
    }

}
