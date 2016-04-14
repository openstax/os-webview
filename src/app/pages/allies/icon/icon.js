import BaseView from '~/helpers/backbone/view';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './icon.hbs';

@props({template})
export default class Icon extends BaseView {
    @on('click [href^="#"]')
    goToBlurb(e) {
        $.scrollTo($.hashTarget(e));
        e.preventDefault();
        e.stopPropagation();
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
        this.el.classList.add('logo');
        this.setVisibility();
    }
}
