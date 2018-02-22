import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './loading-section.html';

export default class LoadingSection extends Controller {

    init() {
        this.template = template;
        this.css = `/app/components/loading-section/loading-section.css?${VERSION}`;
        this.view = {
            classes: ['os-loader']
        };
    }

}
