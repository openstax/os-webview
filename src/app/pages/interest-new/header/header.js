import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
// Several utility functions, including scrollTo and insertHtml
import $ from '~/helpers/$';
import {description as template} from './header.html';

export default class Header extends CMSPageController {

    init() {
        this.template = template;
        this.view = {
            classes: ['interest-form-header']
        };
        // Check this path
        this.css = `/app/pages/interest-new/header/header.css?${VERSION}`;
        this.model = () => this.getModel();
        this.slug = 'pages/interest-form';
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
