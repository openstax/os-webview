import CMSPageController from '~/controllers/cms';
// Several utility functions, including scrollTo and insertHtml
import $ from '~/helpers/$';
import {description as template} from './form-header.html';
import css from './form-header.css';

export default class Header extends CMSPageController {

    init(slug) {
        this.template = template;
        this.slug = slug;
        this.view = {
            classes: ['form-header']
        };
        this.css = css;
        this.model = () => this.getModel();
    }

    // Returns a dictionary of values to be used in the template
    // Refreshes props, to ensure they're up to date
    getModel() {
        return this.pageData ? {
            introHeading: this.pageData.intro_heading,
            introDescription: this.pageData.intro_description
        } : {};
    }

    onDataLoaded() {
        this.update();
        $.insertHtml(this.el, this.model);
    }

}
