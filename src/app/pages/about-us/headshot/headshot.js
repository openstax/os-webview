import BaseView from '~/helpers/backbone/view';
import Remover from '~/components/remover/remover';
import TouchScroller from '~/helpers/touch-scroller';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './headshot.hbs';

@props({
    template,
    regions: {
        details: '.details'
    }
})
export default class Headshot extends BaseView {
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
        if (this.isNarrowScreen()) {
            document.body.classList.add('no-scroll');
            this.el.classList.add('tapped');
            this.remover.el.classList.remove('hidden');
        }
    }

    @on('touchstart .details .description')
    startScrollBio(e) {
        let element = this.el.querySelector('.details .description');

        this.bioScroller.start(element, e);
    }

    @on('touchmove .details .description')
    scrollBio(e) {
        this.bioScroller.scroll(e);
    }

    constructor(templateHelpers, stateModel) {
        super();
        this.templateHelpers = templateHelpers;
        this.stateModel = stateModel;
        this.remover = new Remover(() => {this.removeTapped();});
        this.bioScroller = new TouchScroller();
    }

    onRender() {
        this.el.classList.add('headshot');
        window.addEventListener('resize', this.removeTapped.bind(this));

        if (this.el.firstChild.classList.contains('hidden')) {
            this.el.classList.add('hidden');
        }
        this.regions.details.append(this.remover);
        this.remover.el.classList.add('hidden');
    }
}
