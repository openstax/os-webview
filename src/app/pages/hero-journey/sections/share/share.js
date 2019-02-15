import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './share.html';
import css from './share.css';
import salesforce from '~/models/salesforce';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    view: {
        classes: ['share', 'hidden'],
        tag: 'section'
    },
    css
};

export default class extends componentType(spec) {

    init(model) {
        super.init();
        this.model = model;
        this.model.action = `https://${salesforce.salesforceHome}/servlet/servlet.WebToLead?encoding=UTF-8`;
    }

    @on('submit form')
    watchForResponse() {
        if (!this.listeningForResponse) {
            this.listeningForResponse = true;
            this.el.querySelector('#form-response').addEventListener('load', this.model.onComplete);
        }
    }

    onClose() {
        this.el.querySelector('#form-response').removeEventListener('load', this.model.onComplete);
    }

}
