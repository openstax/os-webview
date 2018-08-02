import VERSION from '~/version';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import salesforce from '~/models/salesforce';
import {description as template} from './how-using.html';

export default class HowUsing extends Controller {

    init(getProps, onChange) {
        this.template = template;
        this.getProps = getProps;
        this.onChange = onChange;
        this.view = {
            classes: ['how-using']
        };
        this.css = `/app/pages/adoption/how-using/how-using.css?${VERSION}`;
        this.model = () => this.getModel();
        this.checked = {};
        this.howMany = {};
        this.value = () => ({
            checked: this.checked,
            howMany: this.howMany
        });
        this.validated = false;
        this.needToDoErrors = false;
        this.numberValidationMessage = (value) => {
            if (this.validated) {
                const el = this.el.querySelector(`[type="number"][name="${this.numberName(value)}"]`);

                return el && el.validationMessage;
            }
            return null;
        };
        this.radioValidationMessage = (value) => {
            if (this.validated) {
                const el = this.el.querySelector(`[type="radio"][name="${this.radioName(value)}"]`);

                return el && el.validationMessage;
            }
            return null;
        };
    }

    getModel() {
        this.props = this.getProps();

        return {
            selectedBooks: this.props.selectedBooks,
            sfOptions: salesforce.adoption(['adopted', 'recommended']),
            radioName: this.radioName,
            numberName: this.numberName,
            numberValidationMessage: this.numberValidationMessage,
            radioValidationMessage: this.radioValidationMessage,
            disable: this.props.disable
        };
    }

    // DOM diffing does not preserve the state of elements
    onUpdate() {
        for (const r of this.el.querySelectorAll('[type="radio"]')) {
            const shouldBeChecked = this.checked[r.name] === r.value;

            r.checked = shouldBeChecked;
        }
        for (const n of this.el.querySelectorAll('[type="number"]')) {
            n.value = this.howMany[n.name] || '';
        }
        // Error messages won't be right if you don't update a second time
        if (this.needToDoErrors) {
            this.needToDoErrors = false;
            this.update();
            setTimeout(() => {
                this.needToDoErrors = this.validated;
            }, 200);
        }
    }

    @on('change [type="radio"]')
    radioChanged(event) {
        const radio = event.delegateTarget;

        this.checked[radio.name] = radio.value;
        this.onChange(this.value());
        this.update();
    }

    @on('input [type="number"]')
    updateHowMany(event) {
        const input = event.delegateTarget;

        this.howMany[input.name] = input.value;
        this.onChange(this.value());
        this.update();
    }

    validate() {
        this.validated = true;
        this.needToDoErrors = true;
        this.update();
        return this.el.querySelector(':invalid');
    }

    numberName(value) {
        return value;
    }

    radioName(value) {
        return value;
    }

}
