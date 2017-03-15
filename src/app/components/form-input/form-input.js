import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './form-input.html';

export default class FormInput extends Controller {

    init(props) {
        this.template = template;
        this.model = props;
        this.view = {
            tag: 'label',
            classes: ['form-input']
        };
    }

}
