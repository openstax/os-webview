import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './headshot.hbs';

@props({template})
export default class Headshot extends BaseView {
    removeTapped() {
        if (this.el.classList.contains('tapped')) {
            document.body.classList.remove('no-scroll');
            this.el.classList.remove('tapped');
        }
    }

    @on('click')
    setClicked() {
        let w = window.innerWidth;

        if (w < 500) {
            document.body.classList.add('no-scroll');
            this.el.classList.add('tapped');
        }
    }

    @on('click .details')
    unsetClicked() {
        let w = window.innerWidth;

        if (w < 500) {
            document.body.classList.remove('no-scroll');
            this.el.classList.remove('tapped');
        }
    }

    constructor(templateHelpers, stateModel) {
        super();
        this.templateHelpers = templateHelpers;
        this.stateModel = stateModel;
    }

    onRender() {
        this.el.classList.add('headshot');
        window.addEventListener('resize', this.removeTapped.bind(this));

        if (this.el.firstChild.classList.contains('hidden')) {
            this.el.classList.add('hidden');
        }
    }
}
