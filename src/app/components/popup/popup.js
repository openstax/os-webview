import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './popup.html';
import css from './popup.css';
import shellBus from '~/components/shell/shell-bus';

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
        shellBus.emit('with-sticky');
    }

    onClose() {
        shellBus.emit('no-sticky');
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
