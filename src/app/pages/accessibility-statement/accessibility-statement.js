import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
import {description as template} from './accessibility-statement.html';

export default class Accessibility extends CMSPageController {

    init() {
        this.template = template;
        this.css = '/app/pages/accessibility-statement/accessibility-statement.css?v2.6.0';
        this.view = {
            classes: ['accessibility-page', 'page']
        };
        this.slug = 'pages/accessibility';
        shell.showLoader();
    }

    onLoaded() {
        document.title = 'Accessibility Statement - OpenStax';
    }

    onDataLoaded() {
        $.insertHtml(this.el, this.pageData);
        shell.hideLoader();
    }

}
