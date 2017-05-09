import {Controller} from 'superb';
import {description as template} from './student-form.html';

export default class StudentForm extends Controller {

    init(postUrl) {
        this.template = template;
        this.view = {
            classes: ['student-form']
        };
        this.css = '/app/components/student-form/student-form.css';
    }

}
