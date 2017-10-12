import {Controller} from 'superb';
import {render as template} from './loading-section.html';

export default class LoadingSection extends Controller {

    init() {
        this.template = template;
        this.css = '/app/components/loading-section/loading-section.css';
        this.view = {
            classes: ['os-loader']
        };
    }

}
