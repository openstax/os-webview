import VERSION from '~/version';
// If pulling data from the CMS
import CMSPageController from '~/controllers/cms';
// If not:
// import {Controller} from 'superb.js';

// For handling events
import {on} from '~/helpers/controller/decorators';
// Several utility functions, including scrollTo and insertHtml
import $ from '~/helpers/$';

// Any components:
import AComponentTemplate from '~/components/a-component-template/a-component-template';

import {description as template} from './a-page-template.html';

// Global-replace a-page-template with the file name of your component
// Replace APageTemplate with the object name of your component

export default class APageTemplate extends CMSPageController {

    init() {
        this.template = template;
        this.view = {
            classes: ['a-page-template', 'page']
        };
        this.css = `/app/pages/a-page-template/a-page-template.css?${VERSION}`;
        // Defines where components may be inserted
        this.regions = {
            component: '.component-region'
        };
        // What will it initially try to pull from the CMS
        this.slug = 'pages/accessibility';

        // Any other state setup
        this.heading = '';
        this.componentMessage = 'Loading';

        this.createComponents();

        // model is an arg for the template and needs its context bound
        this.model = () => this.getModel();
    }

    // model will be executed on every update, which ensures
    // its values are up to date.
    getModel() {
        return {
            heading: this.heading
        };
    }

    createComponents() {
        this.component = new AComponentTemplate(() => ({
            message: this.componentMessage
        }));
    }

    updateComponents() {
        this.component.update();
    }

    // Fires when the page has rendered, a good time to attach child components
    onLoaded() {
        this.regions.component.attach(this.component);
    }

    // Fires when the slug has been loaded (data returned in this.pageData)
    // Content probably needs to be updated
    onDataLoaded() {
        this.heading = this.pageData.intro_heading;
        this.componentMessage = 'Hey, it\'s loaded';
        this.update();
        this.updateComponents();
    }

}
