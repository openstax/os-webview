import {Controller} from 'superb';
import {description as template} from './upper-menu.html';

export default class UpperMenu extends Controller {

    init(model) {
        this.template = template;
        this.view = {
            classes: ['container']
        };
        this.css = '/app/components/shell/header/upper-menu/upper-menu.css';
        this.model = model;
    }

}
