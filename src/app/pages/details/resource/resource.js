import {Controller} from 'superb';
import {description as template} from './resource.html';

export default class Resource extends Controller {

    init(model, alternateLink) {
        this.template = template;
        this.model = model;
        /* eslint camelcase:0 */
        this.model.linkUrl = alternateLink || model.link_document_url || model.link_external;
    }

    onLoaded() {
        this.el.querySelector('resource-description').innerHTML = this.model.resource_description;
    }

}
