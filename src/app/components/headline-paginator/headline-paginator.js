import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './headline-paginator.html';
import css from './headline-paginator.css';

export default class HeadlinePaginator extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['headline-paginator']
        };
        this.css = css;
        this.model = () => this.getModel();
        this.perPage = 10;
        this.pageNumber = 0;
        this.lastPage = 0;
    }

    buttonIf(condition) {
        return condition ? 'button' : 'presentation';
    }

    isOnCurrentPage(n) {
        const firstOnPage = this.pageNumber * this.perPage;

        return n >= firstOnPage && n < firstOnPage + this.perPage;
    }

    getModel() {
        this.props = this.getProps();
        this.lastPage = Math.floor((this.props.contents.length - 1) / this.perPage);

        return {
            contents: this.props.contents,
            hidden: (n) => $.booleanAttribute(!this.isOnCurrentPage(n)),
            newerRole: this.buttonIf(this.pageNumber > 0),
            olderRole: this.buttonIf(this.pageNumber < this.lastPage),
            pageNumber: this.pageNumber
        };
    }

    onLoaded() {
        const Region = this.regions.self.constructor;
        const regions = Array.from(this.el.querySelectorAll('.headline-container'))
            .map((el) => new Region(el, this));

        for (let i=0; i < this.props.contents.length; ++i) {
            regions[i].attach(this.props.contents[i]);
        }
    }

    @on('click .nav-buttons [role="button"]')
    adjustPage(event) {
        if (event.delegateTarget.textContent === 'Newer') {
            this.pageNumber -= 1;
        } else {
            this.pageNumber += 1;
        }
        this.update();
    }

}
