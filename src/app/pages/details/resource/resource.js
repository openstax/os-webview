import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './resource.html';

export default class Resource extends Controller {

    init(model, alternateLink, role) {
        this.template = template;
        this.model = model;
        /* eslint camelcase:0 */
        this.model.linkUrl = alternateLink || model.link_document_url || model.link_external;
        this.model.dataLocal = alternateLink ? 'true' : null;
        this.model.lockToolTip = ({
            instructor: 'Login with a verified instructor account for access',
            student: 'Login with a student account for access'
        })[role];
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}
