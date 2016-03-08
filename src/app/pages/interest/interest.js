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

    onRender() {
        this.el.classList.add('text-content');
        salesforceModel.prefill(this.el);
        for (let ms of this.el.querySelectorAll('select[multiple]')) {
            new TagMultiSelect().replace(ms);
        }
    }
}
