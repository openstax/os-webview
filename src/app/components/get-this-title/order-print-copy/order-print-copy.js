import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './order-print-copy.html';

export default class OrderPrintCopy extends Controller {

    init(props) {
        this.template = template;
        this.props = props;
        this.view = {
            tag: 'nav',
            classes: ['order-print-copy']
        };
        this.css = `/app/components/get-this-title/order-print-copy/order-print-copy.css?${VERSION}`;
        this.model = () => this.getModel();
    }

    getModel() {
        return Object.assign({
            boxCount:
                ['individualLink', 'bookstoreLink', 'bulkLink']
                    .filter((key) => this.props[key]).length
        }, this.props);
    }

}
