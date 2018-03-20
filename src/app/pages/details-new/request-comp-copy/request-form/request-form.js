import VERSION from '~/version';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './request-form.html';

export default class RequestForm extends Controller {

    init(getProps, handlers) {
        this.template = template;
        this.getProps = getProps;
        this.handlers = handlers;
        this.view = {
            classes: ['comp-copy-request-form']
        };
        this.css = `/app/pages/details-new/request-comp-copy/request-form/request-form.css?${VERSION}`;
        this.model = () => this.getModel();
        this.beforeSubmit = true;
    }

    getModel() {
        this.props = this.getProps();

        return {
            title: this.props.title,
            coverUrl: this.props.coverUrl,
            beforeSubmit: this.beforeSubmit
        };
    }

    // TODO This will probably be based on a change to an iframe
    @on('submit form')
    handleSubmit(event) {
        this.beforeSubmit = false;
        this.update();
        this.handlers.showConfirmation();
    }

    @on('click .close-button')
    closeDialog() {
        this.handlers.done();
    }

}
