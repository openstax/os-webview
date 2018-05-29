import {Controller} from 'superb.js';
import Select from '~/components/select/select';
import selectHandler from '~/handlers/select';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './form-select.html';

export default class FormSelect extends Controller {

    static YES_NO_OPTIONS = [
        {label: 'Yes', value: '1'},
        {label: 'No', value: '0'}
    ];

    init(props, onChange) {
        this.template = template;
        this.model = props;
        this.onChange = onChange;
        this.view = {
            tag: 'label',
            classes: ['form-select']
        };
    }

    onLoaded() {
        const config = {
            select: this.el.querySelector('select'),
            placeholder: this.el.querySelector('.proxy-select')
        };

        this.proxyWidget = new Select(config, selectHandler, this);
        $.insertHtml(this.el, this.model);
        selectHandler.controllers.push(this.proxyWidget);
    }

    setOptions(options) {
        this.model.options = options;
        this.update();
        this.proxyWidget.updateOptions();
    }

    @on('change select')
    handleChange(event) {
        if (this.onChange) {
            this.onChange(event.target.value);
        }
    }

}
