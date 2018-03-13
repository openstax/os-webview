import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './institutional-partnership.html';

export default class Institutional extends Controller {

    init() {
        this.template = template;
        this.css = `/app/pages/institutional-partnership/institutional-partnership.css?${VERSION}`;
        this.view = {
            tag: 'main',
            classes: ['institutional-page', 'page']
        };
    }

}
