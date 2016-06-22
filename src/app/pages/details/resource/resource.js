import {Controller} from 'superb';
import {description as template} from './resource.html';

export default class Resource extends Controller {

    init(data, alternateLink) {
        this.template = template;
        this.templateHelpers = data; // FIX: This is not how to use templateHelpers
        /* eslint camelcase:0 */
        this.templateHelpers.linkUrl = alternateLink || data.link_document_url || data.link_external;
    }

}
