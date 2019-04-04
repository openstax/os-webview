import {Controller} from 'superb.js';
import settings from 'settings';
import $ from '~/helpers/$';
import selectHandler from '~/handlers/select';
import routerBus from '~/helpers/router-bus';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './form.html';
import css from './form.css';

const sourceNames = {
    tutor: 'OpenStax Tutor'
};

export default class Form extends Controller {

    // eslint-disable-next-line complexity
    init(model) {
        this.css = css;
        this.template = template;
        this.model = Object.assign(model, {
            postEndpoint: `${settings.apiOrigin}/apps/cms/api/errata/`,
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
        if (this.model.sourceProvided === '') {
            this.model.sourceTypes = [this.model.selectedSource];
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

    @on('keypress .file-button label')
    returnToAttachFile(event) {
        if (event.key === 'Enter') {
            event.delegateTarget.dispatchEvent($.newEvent('click'));
        }
    }

    @on('change [name="resource"]')
    updateSelectedSource(e) {
        this.model.selectedSource = e.target.value;
        this.update();
    }

    @on('change [type="file"]')
    updateFiles(e) {
        const varName = e.target.name.replace('_', '');
        const stripPath = (fullPath) => fullPath.replace(/.*\\/, '');

        this.model[varName] = stripPath(e.target.value);
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

    @on('focusin input,textarea')
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

        // Safari cannot handle empty files; Edge cannot manipulate FormData
        ['file_1', 'file_2'].forEach((name) => {
            const el = formEl.querySelector(`[name="${name}"]`);

            if (el && el.value === '') {
                el.parentNode.removeChild(el);
            }
        });
        const form = new FormData(formEl);

        // Programmatically post the form
        fetch(this.model.postEndpoint, {
            method: 'POST',
            body: form
        }).then((r) => r.json()).then((json) => {
            if (json.id) {
                routerBus.emit('navigate', `/confirmation/errata?id=${json.id}`);
            }
        }).catch((fetchError) => {
            this.model.submitFailed = `Submit failed: ${fetchError}.`;
            this.model.submitted = false;
            this.update();
        });
        e.preventDefault();
    }

    @on('click .clear-file1')
    clearFile1() {
        this.model.file1 = this.model.file2;
        this.model.file2 = '';
        this.update();
    }

    @on('click .clear-file2')
    clearFile2() {
        this.model.file2 = '';
        this.update();
    }

}
