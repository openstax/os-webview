import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './comp-copy.hbs';

@props({
    template: template
})
export default class CompCopyForm extends BaseView {
    @on('change #decision-date')
    formatDate(e) {
        let value = e.target.value,
            year, month, day;

        [year, month, day] = value.split('-');
        document.getElementById('hidden-decision-date').value = [month, day, year].join('/');
    }

    onRender() {
        this.el.classList.add('text-content');
    }
}
