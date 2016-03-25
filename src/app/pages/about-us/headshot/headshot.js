import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './headshot.hbs';

@props({template})
export default class Headshot extends BaseView {
    @on('touchstart .picture-area')
    setTapped() {
        if (this.stateModel) {
            let isTapped = this.stateModel.get('tapped') === this;

            this.stateModel.set('tapped', isTapped ? null : this);
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
