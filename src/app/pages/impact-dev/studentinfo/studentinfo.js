import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './studentinfo.html';

export default class Studentinfo extends Controller {

    init() {
        this.template = template;
        this.css = `/app/pages/impact-dev/studentinfo/studentinfo.css?${VERSION}`;
        this.view = {
            classes: ['studentinfobox']
        };
    }

}
