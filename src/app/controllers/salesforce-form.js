import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';

class SalesforceForm extends Controller {

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

export default SalesforceForm;
