import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './stat.html';

export default class State extends Controller {

    init() {
        this.template = template;
        this.css = `/app/pages/impact-dev/statistics/stat.css?${VERSION}`;
        this.view = {
            classes: ['statbox']
        };
    }

    onLoaded() {
        $.insertHtml(this.el);
    }

}
