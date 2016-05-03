import BaseView from '~/helpers/backbone/view';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './partner.hbs';

@props({template})
export default class Partner extends BaseView {
    @on('click .to-top')
    returnToTop(e) {
        let filterSection = document.querySelector('.filter');

        $.scrollTo(filterSection);
        e.preventDefault();
    }

    setVisibility() {
        let visible = this.stateModel.matchesFilter(this.templateHelpers);

        this.el.classList.toggle('hidden', !visible);
    }

    constructor(templateHelpers, stateModel) {
        super();
        this.templateHelpers = templateHelpers;
        this.stateModel = stateModel;
        stateModel.on('change:selectedFilter', this.setVisibility.bind(this));
    }

    onRender() {
        this.el.classList.add('text');
        this.setVisibility();
    }
}
