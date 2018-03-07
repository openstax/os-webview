import VERSION from '~/version';
import {Controller} from 'superb.js';
// For handling events
import {on} from '~/helpers/controller/decorators';
// Several utility functions, including scrollTo and insertHtml
import $ from '~/helpers/$';
import {description as template} from './a-component-template.html';

// Global-replace a-component-template with the file name of your component
// Replace AComponentTemplate with the object name of your component

export default class AComponentTemplate extends Controller {

    init(getProps, handlers) {
        this.template = template;
        // Props are managed by the parent; do not modify them.
        this.getProps = getProps;
        // Handlers are callbacks from the parent for state changes in the child
        // Parent and child should agree on what handlers are needed
        this.handlers = handlers;
        // For specifying the tag (default div) and classes of the container element
        this.view = {
            classes: ['a-component-template']
        };
        // Check this path
        this.css = `/app/components/a-component-template/a-component-template.css?${VERSION}`;
        // model is an arg for the template and needs its context bound
        // using a function ensures updates are seen
        this.model = () => this.getModel();
    }

    // Returns a dictionary of values to be used in the template
    // Refreshes props, to ensure they're up to date
    getModel() {
        this.props = this.getProps();

        return {
            message: this.props.message
        };
    }

}
