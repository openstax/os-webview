import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
import {description as template} from './accessibility-statement.html';
import css from './accessibility-statement.css';

export default class Accessibility extends CMSPageController {

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['accessibility-page', 'page']
        };
        this.slug = 'pages/accessibility-statement';
        shell.showLoader();
    }

    onDataLoaded() {
        $.insertHtml(this.el, this.pageData);
        shell.hideLoader();
    }

}
