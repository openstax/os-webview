import {Controller} from 'superb';
import {description as template} from './quote.html';

export default class Quote extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['quote-bucket', this.model.orientation || 'full']
        };
    }

    onUpdate() {
        // NOTE: Incremental-DOM currently lacks the ability to inject HTML into a node.
        this.el.querySelector('.content').innerHTML = this.model.content;
    }

}
