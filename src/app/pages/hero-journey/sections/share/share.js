import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './share.html';
import css from './share.css';
import salesforcePromise, {salesforce} from '~/models/salesforce';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    view: {
        classes: ['share', 'hidden'],
        tag: 'section'
    },
    model() {
        return {
            ...baseModel,
            salesforce,
            action: salesforce.webtoleadUrl,
            pulseClass: this.pulseClass
        };
    },
    css
};
const LONG_ENOUGH = 30;

export default class extends componentType(spec) {

    init(model) {
        super.init();
        this.baseModel = model;
        this.pulseClass = '';
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        salesforcePromise.then(() => this.update());
    }

    @on('submit form')
    watchForResponse() {
        if (!this.listeningForResponse) {
            this.listeningForResponse = true;
            this.el.querySelector('#form-response').addEventListener('load', this.model.onComplete);
        }
    }

    @on('input textarea')
    pulseButtonWhenInputLongEnough(event) {
        this.pulseClass = event.target.value.length >= LONG_ENOUGH ? 'pulse' : '';
        this.update();
    }

    onClose() {
        this.el.querySelector('#form-response').removeEventListener('load', this.model.onComplete);
    }

}
