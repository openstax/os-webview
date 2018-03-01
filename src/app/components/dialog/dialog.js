import VERSION from '~/version';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import Contents from '~/pages/details/contents/contents';
import ModalContent from '../modal-content/modal-content';
import {description as template} from './dialog.html';

class Dialog extends Controller {

    init(props) {
        this.template = template;
        this.model = {
            title: props.title
        };
        this.props = props;
        this.css = `/app/components/dialog/dialog.css?${VERSION}`;
        this.regions = {
            main: '.main-region'
        };
        this.view = {
            tag: 'dialog'
        };
    }

    onLoaded() {
        this.regions.main.attach(this.props.contentComponent);
        this.el.setAttribute('aria-labelledby', 'dialog-title');
    }

    @on('click .put-away')
    closeDialog() {
        this.props.closeDialog();
    }

}

// This just composes the Dialog into ModalContent
export default class ModalDialog extends Controller {

    init(props) {
        this.template = () => '';
        this.props = props;
    }

    onLoaded() {
        const dialog = new Dialog(this.props);
        const modalContainer = new ModalContent(dialog);

        this.regions.self.attach(modalContainer);
    }

}
