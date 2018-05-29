import VERSION from '~/version';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './multi-page-form.html';

export default class MultiPageForm extends Controller {

    init(getProps, onSubmit, afterSubmit) {
        this.template = template;
        this.getProps = getProps;
        this.onSubmit = onSubmit;
        this.afterSubmit = afterSubmit;
        this.view = {
            classes: ['multi-page-form']
        };
        this.css = `/app/components/multi-page-form/multi-page-form.css?${VERSION}`;
        this.model = () => this.getModel();
        this.currentPage = 0;
    }

    get currentForm() {
        return this.props.contents[this.currentPage];
    }

    get lastPage() {
        return this.props.contents.length - 1;
    }

    getModel() {
        this.props = this.getProps();

        return {
            action: this.props.action,
            currentPage: this.currentPage,
            lastPage: this.lastPage,
            contents: this.props.contents,
            isHidden: (pageNum) => $.booleanAttribute(pageNum !== this.currentPage),
            hideBack: $.booleanAttribute(this.currentPage === 0),
            hideNext: $.booleanAttribute(this.currentPage === this.lastPage),
            hideSubmit: $.booleanAttribute(this.currentPage < this.lastPage)
        };
    }

    onLoaded() {
        const pageRegions = this.el.querySelectorAll('[data-page]');
        const Region = this.regions.self.constructor;

        for (let i=0; i <= this.lastPage; ++i) {
            const region = new Region(pageRegions[i], this);

            region.attach(this.props.contents[i]);
        }

        window.requestAnimationFrame(() => {
            this.el.querySelector('#form-response').addEventListener('load', this.afterSubmit);
        });
    }

    onClose() {
        this.el.querySelector('#form-response').removeEventListener('load', this.afterSubmit);
    }

    @on('click .next')
    nextPage() {
        const currentForm = this.currentForm;

        if (currentForm.validate) {
            const invalid = currentForm.validate();

            if (invalid) {
                currentForm.update();
                return;
            }
        }

        this.currentPage += 1;
        this.update();
        this.currentForm.el.querySelector($.focusable).focus();
    }

    @on('click .back')
    prevPage() {
        this.currentPage -= 1;
        this.update();
        this.currentForm.el.querySelector($.focusable).focus();
    }

    @on('keydown input')
    interceptSubmit(event) {
        if (event.key === 'Enter') {
            if (this.currentPage < this.lastPage) {
                event.preventDefault();
                this.nextPage();
            }
        }
    }

    @on('submit form')
    handleSubmit(event) {
        if (this.onSubmit) {
            event.preventDefault();
            this.onSubmit(event);
        }
    }

}
