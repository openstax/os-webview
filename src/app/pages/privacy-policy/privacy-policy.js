import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {description as template} from './privacy-policy.html';

export default class PrivacyPolicy extends CMSPageController {

    static description = 'Since 2012, OpenStax has saved students millions ' +
        'through free, peer-reviewed college textbooks. Learn more about our ' +
        'impact on the 3,000+ schools who use our books.';

    init() {
        this.template = template;
        this.view = {
            classes: ['privacy-page', 'page']
        };
        this.model = {
            'intro_heading': '',
            'privacy_content': ''
        };
        this.slug = 'pages/privacy-policy';
    }

    onDataLoaded() {
        Object.assign(this.model, this.pageData);
        this.update();
        $.insertHtml(this.el, this.model);
    }

}
