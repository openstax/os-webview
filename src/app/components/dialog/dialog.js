import VERSION from '~/version';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import Contents from '~/pages/details/contents/contents';
import ModalContent from '../modal-content/modal-content';
import {description as template} from './dialog.html';

class Dialog extends Controller {

    init(getProps, handlers) {
        this.template = template;
        this.getProps = getProps;
        this.handlers = handlers;
        this.css = `/app/components/dialog/dialog.css?${VERSION}`;
        this.regions = {
            main: '.main-region'
        };
        this.view = {
            tag: 'dialog'
        };
        this.model = () => this.getModel();
    }

    getModel() {
        this.props = this.getProps();

        return {
            title: this.props.title
        };
    }

    attachContent() {
        if (this.props.contentComponent) {
            this.regions.main.append(this.props.contentComponent);
        }
    }

    onUpdate() {
        // Wait for region to be instantiated
        setTimeout(() => this.attachContent(), 0);
    }

    onLoaded() {
        this.el.setAttribute('aria-labelledby', 'dialog-title');
        this.attachContent();
    }

    @on('click .put-away')
    closeDialog() {
        const contentComponent = this.props.contentComponent;

        if (contentComponent && contentComponent.el && contentComponent.el.parentNode) {
            contentComponent.el.parentNode.removeChild(contentComponent.el);
        }

        this.regions.main.controllers = [];

        if (this.handlers && this.handlers.closeDialog) {
            this.handlers.closeDialog();
        }
    }

}

// This just composes the Dialog into ModalContent
export default class ModalDialog extends Controller {

    init(getProps, handlers) {
        this.getProps = getProps;
        this.handlers = handlers;
    }

    template() {}

    onLoaded() {
        this.dialog = new Dialog(this.getProps, this.handlers);
        this.regions.self.attach(new ModalContent(this.dialog));
    }

    update() {
        if (this.dialog) {
            this.dialog.update();
        }
    }

}
