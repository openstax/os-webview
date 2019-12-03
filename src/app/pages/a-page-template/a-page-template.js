import componentType from '~/helpers/controller/init-mixin';

// For handling events
import {on} from '~/helpers/controller/decorators';
// Several utility functions, including scrollTo and insertHtml
// import $ from '~/helpers/$';

import {description as template} from './a-page-template.html';
import css from './a-page-template.css';

// Global-replace a-page-template with the file name of your component

const spec = {
    template,
    css,
    view: {
        classes: ['a-page-template', 'page'],
        tag: 'main' // if the HTML doesn't contain a main tag
    },
    slug: 'pages/a-page-template',
    model() {
        return {
            heading: this.heading
        };
    }
};

export default class extends componentType(spec) {

    init() {
        super.init();
        // Any other state setup
        this.heading = '';
    }

    // Fires when the slug has been loaded (data returned in this.pageData)
    // Content probably needs to be updated
    onDataLoaded() {
        this.heading = this.pageData.intro_heading;
        this.componentMessage = 'Hey, it\'s loaded';
        this.update();
    }

}
