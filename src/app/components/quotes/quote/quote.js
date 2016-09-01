import {Controller} from 'superb';
import {makeDocModel} from '~/models/usermodel';
import {description as template} from './quote.html';

export default class Quote extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['quote-bucket', this.model.image.image && this.model.image.alignment || 'full']
        };
        if (model.document) {
            makeDocModel(model.document).load().then((data) => {
                model.overlay = data.file;
                this.update();
            });
        }
    }

    onUpdate() {
        // NOTE: Incremental-DOM currently lacks the ability to inject HTML into a node.
        this.el.querySelector('quote-html').innerHTML = this.model.content;
    }

}
