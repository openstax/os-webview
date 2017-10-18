import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
import {render as template} from './support.html';

const supportHost = 'http://openstax.force.com/support?l=en_US';

export default class Support extends CMSPageController {

    init() {
        document.title = 'Support - OpenStax';
        this.template = template;
        this.css = '/app/pages/support/support.css';
        this.view = {
            classes: ['support-page', 'page']
        };
        this.slug = 'pages/support';
        shell.showLoader();
    }

    onDataLoaded() {
        const d = this.pageData;

        this.model = {
            heading: d.intro_heading,
            description: d.intro_description,
            resources: d.row_1.map((r) => ({
                name: r.heading,
                description: r.content,
                linkUrl: r.link,
                linkText: r.cta
            }))
        };
        this.update();
        $.insertHtml(this.el, this.model);
        shell.hideLoader();
    }

}
