import WrappedJsx from '~/controllers/jsx-wrapper';
import Quote from './quote.jsx';

export default class extends WrappedJsx {

    init(quotes) {
        super.init(Quote, {model: quotes});
    }

}
