import css from './order-print-copy.css';
import WrappedJsx from '~/controllers/jsx-wrapper';
import OrderPrintCopyJsx from './order-print-copy.jsx';

export default class extends WrappedJsx {

    init(model, onNavigate) {
        super.init(OrderPrintCopyJsx, {
            bookstoreContent: model.bookstoreContent,
            amazonLink: model.amazonLink,
            closeAfterDelay(event) {
                if (event) {
                    window.requestAnimationFrame(() => {
                        onNavigate();
                    });
                }
            }
        });
        this.view = {
            tag: 'nav',
            classes: ['order-print-copy']
        };
    }

}
