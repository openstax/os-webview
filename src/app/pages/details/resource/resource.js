import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './resource.hbs';

@props({template})
export default class Resource extends BaseView {
    constructor(data, alternateLink) {
        super();
        this.templateHelpers = data;
        if (alternateLink) {
            /* eslint camelcase:0 */
            this.templateHelpers.link_document_url = alternateLink;
        }
    }
}
