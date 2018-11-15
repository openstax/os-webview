import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './spinner.html';
import css from './spinner.css';

export default class Spinner extends Controller {

    init(model) {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['spinner']
        };
        this.model = model;
    }

    onUpdate() {
        // Template updates attribute; need to update property
        this.el.querySelector('input').value = this.model.value;
    }

    @on('click .up-spinner')
    increment() {
        this.model.value += 1;
        this.update();
    }

    @on('click .down-spinner')
    decrement() {
        this.model.value -= 1;
        this.update();
    }

    @on('input [type=number]')
    updateItem(e) {
        this.model.value = +e.target.value;
        this.update();
    }

}
