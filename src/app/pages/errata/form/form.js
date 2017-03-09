import {Controller} from 'superb';
import settings from 'settings';
import $ from '~/helpers/$';
import selectHandler from '~/handlers/select';
import router from '~/router';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './form.html';

const sourceNames = {
    cc: 'OpenStax Concept Coach',
    tutor: 'OpenStax Tutor'
};

export default class Form extends Controller {

    init(model) {
        this.css = '/app/pages/errata/form/form.css';
        this.template = template;
        this.model = Object.assign(model, {
            postEndpoint: `${settings.apiOrigin}/api/errata/`,
            validationMessage: (name) => {
                const el = this.el.querySelector(`[name="${name}"]`);

                return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
            },
            helpBoxVisible: () => this.model.selectedError === 'Other' ? 'visible' : 'not-visible',
            selectedSource: model.source && sourceNames[model.source.toLowerCase()],
            sourceProvided: model.location && model.source ? '' : null
        });
        for (const book of this.model.books) {
            book.titleText = $.htmlToText(book.title);
        }
    }

    onLoaded() {
        selectHandler.setup(this);
    }

    @on('change [name="error_type"]')
    showOrHideSupportBox() {
        this.model.selectedError = this.el.querySelector('[name="error_type"]:checked').value;
        this.update();
    }

    @on('change [name="resource"]')
    updateSelectedSource(e) {
        this.model.selectedSource = e.target.value;
        this.update();
    }

    @on('change [type="file"]')
    updateFiles(e) {
        const varName = e.target.name.replace('_', '');

        this.model[varName] = e.target.value;
        if (this.model.file2 && !this.model.file1) {
            this.model.file1 = this.model.file2;
            this.model.file2 = '';
        }
        this.update();
    }

    @on('change [name="book"]')
    updateParent(e) {
        const selectedOptions = e.target.selectedOptions;

        if (selectedOptions.length) {
            this.model.selectedTitle = e.target.selectedOptions[0].dataset.stringValue;
            this.parent && this.parent.update();
        }
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
        this.model.visitedClass = 'visited';
        if (invalid) {
            event.preventDefault();
            this.update();
        }
        this.model.submitFailed = '';
    }

    @on('submit form')
    changeSubmitMode(e) {
        this.model.submitted = true;
        this.update();
        const formEl = this.el.querySelector('form');
        const form = new FormData(formEl);

        // Programmatically post the form
        fetch(this.model.postEndpoint, {
            method: 'POST',
            body: form
        }).then((r) => r.json()).then((json) => {
            if (json.id) {
                router.navigate(`/confirmation/errata?id=${json.id}`);
            }
        }).catch((fetchError) => {
            this.model.submitFailed = `Submit failed: ${fetchError}.`;
            this.model.submitted = false;
            this.update();
        });
        e.preventDefault();
    }

}
