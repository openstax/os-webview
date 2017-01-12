import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {description as template} from './accessibility-statement.html';

export default class Accessibility extends CMSPageController {

    init() {
        this.template = template;
        this.css = '/app/pages/accessibility-statement/accessibility-statement.css';
        this.view = {
            classes: ['accessibility-page', 'page']
        };
        this.slug = 'pages/accessibility';
    }

    onLoaded() {
        document.title = 'Accessibility Statement - OpenStax';
    }

    onDataLoaded() {
        $.insertHtml(this.el, this.pageData);
    }

}
