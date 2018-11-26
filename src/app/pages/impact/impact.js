import CMSPageController from '~/controllers/cms';
import shell from '~/components/shell/shell';
import $ from '~/helpers/$';
import {makeDocModel} from '~/models/usermodel';
import {description as template} from './impact.html';
import css from './impact.css';

export default class Impact extends CMSPageController {

    static description = 'Since 2012, OpenStax has saved students millions ' +
        'through free, peer-reviewed college textbooks. Learn more about our ' +
        'impact on the 3,000+ schools who use our books.';

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['impact-page', 'page']
        };
        this.model = {};
        this.slug = 'pages/impact';
        shell.showLoader();
    }

    onDataLoaded() {
        this.model = this.pageData;
        this.update();
        shell.hideLoader();
        $.insertHtml(this.el, this.model);

        const row1 = this.model.row_1[0];

        if (row1.document) {
            makeDocModel(row1.document).load().then((data) => {
                row1.link = data.file;
                this.update();
            });
        }
    }

}
