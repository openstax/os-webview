import {Controller} from 'superb.js';
import salesforcePromise, {salesforce} from '~/models/salesforce';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './request-form.html';
import css from './request-form.css';

export default class RequestForm extends Controller {

    init(getProps, handlers) {
        this.template = template;
        this.getProps = getProps;
        this.handlers = handlers;
        this.view = {
            classes: ['comp-copy-request-form']
        };
        this.css = css;
        this.model = () => this.getModel();
        this.beforeSubmit = true;
    }

    getModel() {
        this.props = this.getProps();

        return {
            title: this.props.title,
            coverUrl: this.props.coverUrl,
            beforeSubmit: this.beforeSubmit,
            salesforce,
            user: this.props.user,
            salesforceTitle: this.props.salesforceTitle,
            notAvailable: this.props.notAvailable
        };
    }

    onLoaded() {
        this.formResponseEl = this.el.querySelector('#form-response');
        salesforcePromise.then(() => this.update());
    }

    onClose() {
        this.formResponseEl.removeEventListener('load', this.goToConfirmation);
    }

    @on('submit form')
    handleSubmit() {
        this.goToConfirmation = () => {
            this.beforeSubmit = false;
            this.update();
            this.handlers.showConfirmation();
        };
        this.formResponseEl.addEventListener('load', this.goToConfirmation);
    }

    @on('click .close-button')
    @on('click [type="reset"]')
    closeDialog() {
        this.handlers.done();
    }

}
