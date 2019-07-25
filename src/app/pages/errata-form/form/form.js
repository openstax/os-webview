import {Controller} from 'superb.js';
import {description as template} from './form.html';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import css from './form.css';
import routerBus from '~/helpers/router-bus';
import {getFields} from '~/models/errata-fields';
import shellBus from '~/components/shell/shell-bus';
import BannedNotice from '../banned-notice/banned-notice';
import selectHandler from '~/handlers/select';
import settings from 'settings';

const sourceNames = {
    tutor: 'OpenStax Tutor'
};
const modelConstants = {
    postEndpoint: `${settings.apiOrigin}${settings.apiPrefix}/errata/`,
    errorTypes: [
        'Broken link',
        'Incorrect answer, calculation, or solution',
        'General/pedagogical suggestion or question',
        'Other factual inaccuracy in content',
        'Typo',
        'Other'
    ],
    sourceTypes: [],
    subnotes: {'Textbook': 'includes print, PDF, and web view'}
};

export default class Form extends Controller {

    // eslint-disable-next-line complexity
    init(model) {
        this.css = css;
        this.template = template;
        this.model = Object.assign(
            model,
            {
                validationMessage: (name) => {
                    const el = this.el.querySelector(`[name="${name}"]`);

                    return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
                },
                helpBoxVisible: () => this.model.selectedError === 'Other' ? 'visible' : 'not-visible',
                selectedSource: model.source && sourceNames[model.source.toLowerCase()],
                sourceProvided: model.location && model.source ? '' : null
            },
            modelConstants
        );
        this.model.filterSources = (t) => t !== 'OpenStax Tutor' || this.model.isTutor;
        this.resourcePromise = getFields('resources');
    }

    onLoaded() {
        selectHandler.setup(this);
        this.resourcePromise.then((resources) => {
            Reflect.ownKeys(resources).forEach((key) => {
                this.model.sourceTypes.push(resources[key].field);
            });
            this.model.books.forEach((book) => {
                book.titleText = $.htmlToText(book.title);
            });
            if (this.model.sourceProvided === '') {
                this.model.sourceTypes = [this.model.selectedSource];
            }
            this.update();
        });
    }

    onUpdate() {
        if (super.onUpdate) {
            super.onUpdate();
        }
        const fileInputs = Array.from(this.el.querySelectorAll('input[type="file"]'));

        fileInputs.forEach((el, i) => {
            el.setAttribute('name', `file_${i + 1}`);
        });
    }

    @on('change [name="error_type"]')
    showOrHideSupportBox(event) {
        this.model.selectedError = event.delegateTarget.value;
        this.update();
    }

    @on('keypress .file-button label')
    returnToAttachFile(event) {
        if (event.key === 'Enter') {
            event.delegateTarget.dispatchEvent(new Event('click', {bubbles: true}));
        }
    }

    @on('change [name="resource"]')
    updateSelectedSource(e) {
        this.model.selectedSource = e.target.value;
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
            } else if (json.submitted_by_account_id) {
                shellBus.emit('showDialog', () => ({
                    title: 'Errata submission rejected',
                    content: new BannedNotice({
                        model: {
                            text: json.submitted_by_account_id[0]
                        }
                    })
                }));
            }
        }).catch((fetchError) => {
            this.model.submitFailed = `Submit failed: ${fetchError}.`;
            this.model.submitted = false;
            this.update();
        });
        e.preventDefault();
    }

    setVisibleFileNameFromFileInput(el) {
        const name = el.name.replace('_', '');
        const path = el.value.replace(/.*\\/, '');

        this.model[name] = path;
    }

    @on('change [type="file"]')
    updateFiles(e) {
        this.setVisibleFileNameFromFileInput(e.target);

        if (this.model.file2 && !this.model.file1) {
            this.clearFile1();
        } else {
            this.update();
        }
    }

    @on('click .clear-file1')
    clearFile1() {
        const el1 = this.el.querySelector('[name="file_1"]');

        el1.value = null;
        this.setVisibleFileNameFromFileInput(el1);

        // Values are not settable in file input items; you have to move the input
        if (this.model.file2) {
            const el2 = this.el.querySelector('[name="file_2"]');
            const el3 = el2.cloneNode(true);

            el2.parentNode.insertBefore(el3, el2);
            el1.parentNode.insertBefore(el2, el1);
            el1.remove();
            el2.setAttribute('name', 'file_1');
            el2.name = 'file_1';
            this.setVisibleFileNameFromFileInput(el2);
            this.model.file2 = '';
        }
        this.update();
    }

    @on('click .clear-file2')
    clearFile2() {
        const el2 = this.el.querySelector('[name="file_2"]');

        el2.value = null;
        this.setVisibleFileNameFromFileInput(el2);
        this.update();
    }

}
