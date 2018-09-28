import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {description as template} from './license.html';

export default class License extends CMSPageController {

    init() {
        this.template = template;
        this.view = {
            classes: ['license-page', 'page']
        };
        this.slug = 'pages/license';
    }

    onDataLoaded() {
        $.insertHtml(this.el, this.pageData);
    }

}
