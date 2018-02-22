import {Controller} from 'superb.js';
import {description as template} from './form-checkboxgroup.html';

export default class FormCheckboxGroup extends Controller {

    init(props) {
        this.template = template;
        // this.css = '/app/components/form-input/form-input.css?v2.6.0';
        this.model = props;
        this.view = {
            classes: ['form-checkboxgroup']
        };
    }

}
