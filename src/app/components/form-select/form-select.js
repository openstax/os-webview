import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import Select from '~/components/select/select';
import selectHandler from '~/handlers/select';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './form-select.html';

const spec = {
    template,
    view: {
        tag: 'label',
        classes: ['form-select']
    }
};

export default class FormSelect extends componentType(spec, busMixin) {

    init(props) {
        super.init();
        this.model = props;
    }

    onLoaded() {
        const config = {
            select: this.el.querySelector('select'),
            placeholder: this.el.querySelector('.proxy-select')
        };

        this.proxyWidget = new Select(config, selectHandler, this);
        this.insertHtml();
        selectHandler.controllers.push(this.proxyWidget);
        this.on('set-value', (...args) => {
            this.proxyWidget.updateOptions();
        });
    }

    setOptions(options) {
        this.model.options = options;
        this.update();
        this.proxyWidget.updateOptions();
    }

    @on('change select')
    handleChange(event) {
        this.emit('change', event.target.value);
    }

}
