import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './checkbox.hbs';

@props({
    template: template
})

export default class CheckboxView extends BaseView {
    constructor(templateHelpers) {
        super();
        this.templateHelpers = templateHelpers;
    }

    onRender() {
        let cb = document.getElementById(this.templateHelpers.id),
            textBoxInfo = this.templateHelpers.textInput;

        if (textBoxInfo) {
            let tb = document.getElementById(textBoxInfo.id);

            cb.addEventListener('change', (event) => {
                let checked = event.target.checked;

                if (!checked) {
                    tb.value = '';
                }
                tb.disabled = !checked;
            });
        }
        this.trigger('render');
    }
}
