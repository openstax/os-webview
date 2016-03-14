import BaseView from '~/helpers/backbone/view';
import salesforceModel from '~/models/salesforce-model';
import TagMultiSelect from '~/components/tag-multi-select/tag-multi-select';
import bookTitles from '~/helpers/book-titles';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './interest.hbs';

@props({
    template: template,
    templateHelpers: {
        titles: bookTitles,
        urlOrigin: window.location.origin
    }
})
export default class InterestForm extends BaseView {
    @on('change [type=text],[type=email]')
    saveSetting(event) {
        let varName = event.target.name;

        if (varName) {
            salesforceModel.set(varName, event.target.value);
        }
    }

    failIfInvalid(event) {
        this.el.querySelector('form').classList.add('has-been-submitted');
        for (let widget of this.selectWidgets) {
            widget.doValidChecks();
        }
        let invalid = this.el.querySelectorAll('.invalid');

        if (invalid.length > 0) {
            event.preventDefault();
        }
    }

    onRender() {
        this.el.classList.add('text-content');
        salesforceModel.prefill(this.el);
        this.selectWidgets = [];
        for (let ms of this.el.querySelectorAll('select[multiple]')) {
            let widget = new TagMultiSelect();

            widget.replace(ms);
            this.selectWidgets.push(widget);
        }
        this.el.querySelector('[type=submit]').addEventListener('click', this.failIfInvalid.bind(this));
    }

    onBeforeClose() {
        this.el.querySelector('[type=submit]').removeEventListener('click', this.failIfInvalid.bind(this));
    }
}
