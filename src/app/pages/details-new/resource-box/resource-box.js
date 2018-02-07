import VERSION from '~/version';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './resource-box.html';

export default class ResourceBox extends Controller {

    init(model) {
        this.model = model;
        this.template = template;
        this.view = {
            classes: ['resource-box']
        };
        this.css = `/app/pages/details-new/resource-box/resource-box.css?${VERSION}`;
    }

}
