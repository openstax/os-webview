import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import bookTitles from '~/models/book-titles';
import {description as template} from './interest.html';

export default class InterestForm extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/interest/interest.css';
        this.view = {
            classes: ['interest-form']
        };

        const titles = bookTitles.map((titleData) =>
            titleData.text ? titleData : {
                text: titleData,
                value: titleData
            }
        );

        this.model = {
            titles,
            validationMessage: (name) =>
                this.hasBeenSubmitted ? this.el.querySelector(`[name="${name}"]`).validationMessage : ''
        };
    }

    onLoaded() {
        document.title = 'Interest Form - OpenStax';
        selectHandler.setup(this);
    }

    @on('focusout input')
    markVisited(event) {
        event.delegateTarget.classList.add('visited');
    }

    @on('click [type="submit"]')
    doCustomValidation(event) {
        const invalids = this.el.querySelectorAll('input:invalid');

        this.hasBeenSubmitted = true;
        if (invalids.length) {
            event.preventDefault();
            this.update();
        }
    }

    @on('change')
    updateOnChange() {
        this.update();
    }

}
