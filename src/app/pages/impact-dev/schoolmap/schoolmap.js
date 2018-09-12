import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './schoolmap.html';

export default class Schoolmap extends Controller {

    init() {
        this.template = template;
        this.css = `/app/pages/impact-dev/schoolmap/schoolmap.css?${VERSION}`;
        this.view = {
            classes: ['schoolmapbox']
        };
    }

}
