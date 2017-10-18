import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {makeDocModel} from '~/models/usermodel';
import {render as template} from './quote.html';

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
        $.insertHtml(this.el, this.model);
    }

}
