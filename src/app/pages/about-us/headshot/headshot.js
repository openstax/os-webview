import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './headshot.hbs';

@props({template})
export default class Headshot extends BaseView {
    @on('touchstart .picture-area')
    setTapped() {
        let isTapped = this.stateModel.get('tapped') === this;

        this.stateModel.set('tapped', isTapped ? null : this);
        this.stateModel.set('openedOnTouch', true);
    }

    @on('touchstart .details')
    unsetTapped() {
        this.stateModel.set('tapped', null);
        setTimeout(() => this.stateModel.set('openedOnTouch', false), 200);
    }

    @on('mouseenter .picture-area')
    setTappedOnHover() {
        if (!this.stateModel.get('openedOnTouch')) {
            this.stateModel.set('tapped', this);
        }
    }

    @on('mouseleave')
    unsetTappedOnExit(e) {
        let movingTo = e.toElement || e.relatedTarget;

        if (!this.el.contains(movingTo) && !this.stateModel.get('openedOnTouch')) {
            this.stateModel.set('tapped', null);
        }
    }

    constructor(templateHelpers, stateModel) {
        super();
        this.templateHelpers = templateHelpers;
        this.stateModel = stateModel;
    }

    onRender() {
        if (this.stateModel) {
            this.stateModel.on('change:tapped', (what) => {
                this.el.classList.toggle('tapped', what.changed.tapped === this);
            });
        }
        this.el.classList.add('headshot');
        let image = this.el.querySelector('img'),
            isChrome = navigator.userAgent.indexOf('Chrome') > -1,
            isSafari = !isChrome && navigator.userAgent.indexOf('Safari') > -1;

        if (image && isSafari) {
            image.classList.add('safari');
        }
    }
}
