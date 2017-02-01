import {Controller} from 'superb';
import settings from 'settings';
import selectHandler from '~/handlers/select';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './form.html';

export default class Form extends Controller {

    init(model) {
        this.template = template;
        this.model = Object.assign(model, {
            postEndpoint: `${settings.apiOrigin}/api/errata/`,
            validationMessage: (name) => {
                const el = this.el.querySelector(`[name="${name}"]`);

                return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
            },
            helpBoxVisible: () => this.selectedError === 'Other' ? 'visible' : 'not-visible',
            selectedSource: model.assessmentId ? 'OpenStax Tutor' : null,
            location: model.assessmentId ? `Assessment ${model.assessmentId}` : ''
        });
    }

    onLoaded() {
        selectHandler.setup(this);
    }

    @on('change [name="error_type"]')
    showOrHideSupportBox() {
        this.selectedError = this.el.querySelector('[name="error_type"]:checked').value;
        this.update();
    }

    @on('change [name="source"]')
    updateSelectedSource(e) {
        this.model.selectedSource = e.target.value;
    }

    @on('change [name="book"]')
    updateParent(e) {
        this.model.selectedTitle = e.target.selectedOptions[0].dataset.stringValue;
        this.parent && this.parent.update();
    }

    @on('focusout input')
    markVisited(event) {
        event.delegateTarget.classList.add('visited');
    }

    @on('change')
    updateOnChange() {
        this.update();
    }

    @on('click [type="submit"]')
    doCustomValidation(event) {
        const invalid = this.el.querySelector('form :invalid');

        this.hasBeenSubmitted = true;
        if (invalid) {
            event.preventDefault();
            this.update();
        }
    }

    @on('submit form')
    changeSubmitMode() {
        this.submitted = true;
        this.update();
    }

}
