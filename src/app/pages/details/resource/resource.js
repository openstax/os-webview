import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {render as template} from './resource.html';

export default class Resource extends Controller {

    init(model, alternateLink) {
        this.template = template;
        this.model = model;
        /* eslint camelcase:0 */
        this.model.linkUrl = alternateLink || model.link_document_url || model.link_external;
        this.model.dataLocal = alternateLink ? 'true' : null;
        this.model.lockToolTip ='Login with a verified instructor account for access';
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}
