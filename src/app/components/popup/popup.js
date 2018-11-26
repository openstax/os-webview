import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './popup.html';
import css from './popup.css';

export default class Popup extends Controller {

    init(message) {
        this.template = template;
        this.model = {
            message
        };
        this.view = {
            tag: 'pop-up',
            classes: ['page-overlay']
        };
        this.css = css;
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
        if ([$.key.space, $.key.enter, $.key.esc].includes(e.key)) {
            this.goAway();
        }
    }

}
