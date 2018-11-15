import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
import {description as template} from './careers.html';
import css from './careers.css';

export default class Careers extends CMSPageController {

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['careers-page', 'page']
        };
        this.slug = 'pages/careers';
        shell.showLoader();
    }

    onLoaded() {
        document.title = 'Careers - OpenStax';
    }

    onDataLoaded() {
        document.title = this.pageData.title;
        $.insertHtml(this.el, this.pageData);
        shell.hideLoader();
    }

}
