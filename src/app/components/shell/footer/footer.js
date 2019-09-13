import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import settings from 'settings';
import {description as template} from './footer.html';
import css from './footer.css';

export default class extends CMSPageController {

    init() {
        this.el = document.getElementById('footer');
        this.template = template;
        this.css = css;
        this.view = {
            tag: 'footer',
            classes: ['page-footer']
        };
        this.model = {};
        this.slug = 'footer';
    }

    onDataLoaded() {
        const pd = this.pageData;

        Object.assign(this.model, {
            apStatement: pd.ap_statement,
            copyright: pd.copyright,
            supporters: pd.supporters,
            twitterLink: pd.twitter_link,
            facebookLink: pd.facebook_link,
            linkedinLink: pd.linkedin_link
        });
        this.update();
        this.onLoaded();
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}
