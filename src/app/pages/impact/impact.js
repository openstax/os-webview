import CMSPageController from '~/controllers/cms';
import shell from '~/components/shell/shell';
import $ from '~/helpers/$';
import {description as template} from './impact.html';

export default class Impact extends CMSPageController {

    static description = 'Since 2012, OpenStax has saved students millions ' +
        'through free, peer-reviewed college textbooks. Learn more about our ' +
        'impact on the 3,000+ schools who use our books.';

    init() {
        this.template = template;
        this.css = '/app/pages/impact/impact.css';
        this.view = {
            classes: ['impact-page', 'page']
        };
        this.model = {};
        this.slug = 'pages/our-impact';
        shell.showLoader();
    }

    onDataLoaded() {
        document.title = `${this.pageData.title} - OpenStax`;
        this.model = this.pageData;
        this.update();
        shell.hideLoader();
        $.insertHtml(this.el, this.model);
    }

}
