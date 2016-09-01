import CMSPageController from '~/controllers/cms';
import {description as template} from './foundation.html';

export default class Foundation extends CMSPageController {

    static description = 'OpenStax is supported by our philanthropic ' +
        'sponsors like the Bill & Melinda Gates Foundation, the William and Flora ' +
        'Hewlett Foundation, and more.';

    init() {
        document.title = 'Sponsors - OpenStax';
        this.template = template;
        this.css = '/app/pages/foundation/foundation.css';
        this.view = {
            classes: ['foundation-page', 'page']
        };
        this.slug = '/pages/foundation-support';
        this.model = {
            title: '',
            'page_description': ''
        };
    }

    onDataLoaded() {
        Object.assign(this.model, this.pageData);
        this.update();
    }

}
