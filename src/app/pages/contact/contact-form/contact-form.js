import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {salesforceFormFunctions} from '~/helpers/controller/salesforce-form-mixin';
import {description as template} from './contact-form.html';
import selectHandler from '~/handlers/select';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';

const subjects = [
    'General',
    'Adopting OpenStax Textbooks',
    'OpenStax Tutor Support',
    'OpenStax CNX',
    'Donations',
    'College/University Partnerships',
    'Media Inquiries',
    'Foundational Support',
    'OpenStax Partners',
    'Website',
    'OpenStax Polska'
];
const spec = {
    template,
    model() {
        return {
            subjects,
            selected: (subj) => $.booleanAttribute(subj === this.selectedSubject),
            validationMessage: this.validationMessage
        };
    }
};

export default class extends componentType(spec, busMixin, salesforceFormFunctions) {

    init(...args) {
        if (super.init) {
            super.init(...args);
        }
        const queryDict = $.parseSearchString(window.location.search);

        this.selectedSubject = queryDict.subject ? queryDict.subject[0] : 'General';
        this.validationMessage = (name) => {
            const el = this.el.querySelector(`[name="${name}"]`);

            return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
        };
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        selectHandler.setup(this);
        this.notifyIfPolishStateChanged();
    }

    notifyIfPolishStateChanged() {
        const newPolishState = this.selectedSubject === 'OpenStax Polska';

        if (this.polishState !== newPolishState) {
            this.emit('is-polish', newPolishState);
            this.polishState = newPolishState;
        }
    }

    @on('change [name="subject"]')
    updateSelectedSubject(event) {
        this.selectedSubject = event.target.value;
        this.update();
        this.notifyIfPolishStateChanged();
    }

};
