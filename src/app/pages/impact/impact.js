import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import shell from '~/components/shell/shell';
import $ from '~/helpers/$';
import {makeDocModel} from '~/models/usermodel';
import {description as template} from './impact.html';

export default class Impact extends CMSPageController {

    static description = 'Since 2012, OpenStax has saved students millions ' +
        'through free, peer-reviewed college textbooks. Learn more about our ' +
        'impact on the 3,000+ schools who use our books.';

    init() {
        this.template = template;
        this.css = `/app/pages/impact/impact.css?${VERSION}`;
        this.view = {
            classes: ['impact-page', 'page']
        };
        this.model = {};
        this.slug = 'pages/our-impact';
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
