import {Controller} from 'superb.js';
import {description as template} from './loading-section.html';

export default class LoadingSection extends Controller {

    init() {
        this.template = template;
        this.css = '/app/components/loading-section/loading-section.css?v2.6.0';
        this.view = {
            classes: ['os-loader']
        };
    }

}
