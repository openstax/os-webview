import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {description as template} from './tos.html';

export default class Tos extends CMSPageController {

    static description = 'Since 2012, OpenStax has saved students millions ' +
        'through free, peer-reviewed college textbooks. Learn more about our ' +
        'impact on the 3,000+ schools who use our books.';

    init() {
        this.template = template;
        this.css = '/app/pages/tos/tos.css';
        this.view = {
            classes: ['tos-page', 'page']
        };
        this.model = {
            'intro_heading': '',
            'terms_of_service_content': ''
        };
        this.slug = 'pages/tos';
    }

    onDataLoaded() {
        document.title = `${this.pageData.title} - OpenStax`;
        Object.assign(this.model, this.pageData);
        this.update();
        $.insertHtml(this.el, this.model);
    }

}
