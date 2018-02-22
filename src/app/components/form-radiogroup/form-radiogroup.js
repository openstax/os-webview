import {Controller} from 'superb.js';
import {description as template} from './form-radiogroup.html';

export default class FormRadioGroup extends Controller {

    init(props) {
        this.template = template;
        this.model = props;
        this.view = {
            classes: ['form-radiogroup']
        };
    }

}
