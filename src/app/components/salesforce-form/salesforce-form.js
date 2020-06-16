import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {salesforceFormFunctions} from '~/helpers/controller/salesforce-form-mixin';
import {description as template} from './salesforce-form.html';
import salesforcePromise, {salesforce} from '~/models/salesforce';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    model() {
        const defaultPostTo = `https://${salesforce.salesforceHome}/servlet/servlet.WebToCase?encoding=UTF-8`;

        return {
            oid: salesforce.oid,
            postTo: this.postTo || defaultPostTo
        };
    },
    afterSubmit() {
    },
    postTo: null,
    regions: {
        formBody: '.form-content'
    }
};

function selfRemovingListener(target, eventName, callback) {
    const selfRemoving = (event) => {
        callback(event);
        target.removeEventListener(eventName, selfRemoving);
    };

    target.addEventListener(eventName, selfRemoving);
}

export default class extends componentType(spec, busMixin, salesforceFormFunctions) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        salesforcePromise.then(() => this.update());
    }

    @on('submit form')
    watchForResponse(event) {
        const responseTarget = this.el.querySelector(`[name="${event.target.target}"]`);

        this.listeningForResponse = true;
        selfRemovingListener(responseTarget, 'load', this.afterSubmit.bind(this));
    }

};
