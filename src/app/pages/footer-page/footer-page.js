import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
import {description as template} from './footer-page.html';
import css from './footer-page.css';

export default class FooterPage extends CMSPageController {

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['footer-page', 'page']
        };
        this.slug = `pages${window.location.pathname}`;
        shell.showLoader();
    }

    onDataLoaded() {
        document.title = this.pageData.title;
        const contentFieldName = Reflect.ownKeys(this.pageData).find((k) => k.match(/_content$/));

        $.insertHtml(this.el, {
            heading: this.pageData.intro_heading,
            content: this.pageData[contentFieldName]
        });
        shell.hideLoader();
    }

}
