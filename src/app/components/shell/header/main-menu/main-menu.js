import {Controller} from 'superb';
import {description as template} from './main-menu.html';

export default class MainMenu extends Controller {

    init(handlers) {
        this.template = template;
        this.view = {
            classes: ['container']
        };
        this.css = '/app/components/shell/header/main-menu/main-menu.css';
        this.handlers = handlers;
    }

}
