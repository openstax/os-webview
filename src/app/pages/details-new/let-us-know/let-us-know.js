import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './let-us-know.html';

export default class LetUsKnow extends Controller {

    // TODO handle icon color
    init(getProps) {
        this.getProps = getProps;
        this.updateProps();
        this.template = template;
        this.view = {
            classes: ['let-us-know']
        };
        this.css = `/app/pages/details-new/let-us-know/let-us-know.css?${VERSION}`;
    }

    updateProps() {
        this.props = this.getProps();
    }

    update() {
        this.updateProps();
        super.update();
    }

}
