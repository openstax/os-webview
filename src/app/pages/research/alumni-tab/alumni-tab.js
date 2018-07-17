import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './alumni-tab.html';

export default class AlumniTab extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['alumni-tab']
        };
        this.css = `/app/pages/research/alumni-tab/alumni-tab.css?${VERSION}`;
    }

}
