import WrappedJsx from '~/controllers/jsx-wrapper';
import ErrataDetail from './errata-detail.jsx';

export default class extends WrappedJsx {

    init() {
        super.init(ErrataDetail, {
            slug: window.location.pathname.substr(1)
        });
        this.view = {
            classes: ['errata-detail', 'page']
        };
    }

}
