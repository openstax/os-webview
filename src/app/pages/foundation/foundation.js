import CMSPageController from '~/controllers/cms';
import shell from '~/components/shell/shell';
import {description as template} from './foundation.html';
import css from './foundation.css';

export default class Foundation extends CMSPageController {

    static description = 'OpenStax is supported by our philanthropic ' +
        'sponsors like the Bill & Melinda Gates Foundation, the William and Flora ' +
        'Hewlett Foundation, and more.';

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['foundation-page', 'page'],
            tag: 'main'
        };
        this.slug = '/pages/foundation';
        this.model = {
            title: '',
            'page_description': ''
        };
        shell.showLoader();
    }

    onDataLoaded() {
        Object.assign(this.model, this.pageData);
        this.update();
        shell.hideLoader();
    }

}
