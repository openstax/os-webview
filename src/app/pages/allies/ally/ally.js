import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './ally.hbs';

@props({template})
export default class Ally extends BaseView {
    constructor(templateHelpers, stateModel) {
        super();
        this.templateHelpers = templateHelpers;
        stateModel.on('change:selectedFilter', (what) => {
            let subject = what.changed.selectedFilter,
                visible = (subject === 'View All' ||
                this.templateHelpers.subjects.indexOf(subject) >= 0);

            this.el.classList.toggle('hidden', !visible);
        });
    }

    onRender() {
        this.el.classList.add('ally-info');
    }
}
