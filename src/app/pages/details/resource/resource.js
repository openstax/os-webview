import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './resource.hbs';

@props({
    template: template
})
export default class Resource extends BaseView {

    @on('click [href*="login"]')
    loginInThisTab(e) {
        window.location = e.currentTarget.href;
        e.preventDefault();
    }

    constructor(data, alternateLink) {
        super();
        this.templateHelpers = data;
        if (alternateLink) {
            /* eslint camelcase:0 */
            this.templateHelpers.link_document_url = alternateLink;
        }
    }

}
