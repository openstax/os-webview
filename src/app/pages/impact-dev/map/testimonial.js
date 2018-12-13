import {Controller} from 'superb.js';
import {description as template} from './testimonial.html';
import css from './map.css';

export default class Testmonialinfo extends Controller {

    init(props) {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['toggle-datalist-body']
        };
        this.model = props;
    }

}
