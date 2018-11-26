import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './student-form.html';
import css from './student-form.css';

export default class StudentForm extends Controller {

    init(postUrl) {
        this.template = template;
        this.view = {
            classes: ['student-form']
        };
        this.css = css;
    }

    @on('click button')
    goBack() {
        history.back();
    }

}
