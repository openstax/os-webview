import {Controller} from 'superb.js';
import {description as template} from './form-checkboxgroup.html';

export default class FormCheckboxGroup extends Controller {

    init(props) {
        this.template = template;
        this.model = props;
        this.view = {
            classes: ['form-checkboxgroup']
        };
    }

}
