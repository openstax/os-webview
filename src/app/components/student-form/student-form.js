import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './student-form.html';

export default class StudentForm extends Controller {

    init(postUrl) {
        this.template = template;
        this.view = {
            classes: ['student-form']
        };
        this.css = '/app/components/student-form/student-form.css?v2.6.0';
    }

    @on('click button')
    goBack() {
        history.back();
    }

}
