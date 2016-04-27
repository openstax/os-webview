import BaseView from '~/helpers/backbone/view';
import Remover from '~/components/remover/remover';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './headshot.hbs';

@props({
    template,
    regions: {
        details: '.details'
    }
})
export default class Headshot extends BaseView {
    addTapped() {
        if (this.isNarrowScreen()) {
            document.body.classList.add('no-scroll');
        }
        this.el.classList.add('tapped');
        this.remover.el.classList.remove('hidden');
    }

    removeTapped() {
        if (this.el.classList.contains('tapped')) {
            document.body.classList.remove('no-scroll');
            this.el.classList.remove('tapped');
        }
        this.remover.el.classList.add('hidden');
    }

    isNarrowScreen() {
        return window.innerWidth < 500;
    }

    @on('click')
    setClicked() {
        if ($.isTouchDevice() || this.isNarrowScreen()) {
            this.stateModel.set('active', this);
        }
    }

    constructor(templateHelpers, stateModel) {
        super();
        this.templateHelpers = templateHelpers;
        this.stateModel = stateModel;
        this.remover = new Remover(() => {
            stateModel.set('active', null);
        });
        stateModel.on('change:active', () => {
            let newValue = stateModel.get('active');

            if (newValue === this) {
                this.addTapped();
            } else {
                this.removeTapped();
            }
        });
    }

    onRender() {
        this.el.classList.add('headshot');
        window.addEventListener('resize', this.removeTapped.bind(this));

        if (this.el.firstChild.classList.contains('hidden')) {
            this.el.classList.add('hidden');
        }
        this.regions.details.append(this.remover);
        this.remover.el.classList.add('hidden');
        $.applyScrollFix(this);
    }
}
