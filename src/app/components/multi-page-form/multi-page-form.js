import VERSION from '~/version';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './multi-page-form.html';

export default class MultiPageForm extends Controller {

    init(getProps, handlers) {
        this.template = template;
        this.getProps = getProps;
        this.handlers = handlers;
        this.view = {
            tag: ['form'],
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
        // TODO: set attributes of form
        const pageRegions = this.el.querySelectorAll('[data-page]');
        const Region = this.regions.self.constructor;

        for (let i=0; i <= this.lastPage; ++i) {
            const region = new Region(pageRegions[i], this);

            region.attach(this.props.contents[i]);
        }
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
    }

    @on('click .back')
    prevPage() {
        this.currentPage -= 1;
        this.update();
    }

}
