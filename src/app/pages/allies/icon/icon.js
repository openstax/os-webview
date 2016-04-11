import BaseView from '~/helpers/backbone/view';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './icon.hbs';

@props({template})
export default class Icon extends BaseView {
    @on('click [href^="#"]')
    goToBlurb(e) {
        let target = e.target;

        while (!target.href) {
            target = target.parentNode;
        }
        let hash = new URL(target.href).hash,
            targetEl = document.getElementById(hash.substr(1));

        $.scrollTo(targetEl);
        e.preventDefault();
        e.stopPropagation();
    }

    constructor(templateHelpers, stateModel) {
        super();
        this.templateHelpers = templateHelpers;
        let matchesFilter = (subject) => (subject === 'View All' ||
            (subject === 'AP®' && templateHelpers.isAp) ||
            templateHelpers.subjects.indexOf(subject) >= 0);

        stateModel.on('change:selectedFilter', (what) => {
            let subject = what.changed.selectedFilter,
                visible = matchesFilter(subject);

            this.el.classList.toggle('hidden', !visible);
        });
    }

    onRender() {
        this.el.classList.add('logo');
    }
}
