import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './us-history.hbs';
import seeThru from 'seeThru';

@props({
    template: template
})
export default class USHistory extends BaseView {

    constructor(options) {
        super();

        this.parent = options.parent;
    }

    onRender() {
        let el = this.el;
        let poster = el.querySelector('.video-banner');
        let noVideo = window.innerWidth < 780 ||
            (navigator.userAgent.indexOf('Safari') > -1 &&
            navigator.userAgent.indexOf('Chrome') === -1 &&
            navigator.userAgent.match(/(iPhone|iPod)/));

        if (!noVideo) {
            seeThru.create('.video')
            .ready((instance, video, canvas) => {
                poster.style.display = 'none';

                setTimeout(() => {
                    let flyins = el.querySelectorAll('.flyin');

                    for (let flyin of flyins) {
                        flyin.classList.remove('flyin');
                        flyin.classList.add('flyout');
                    }

                    setTimeout(() => {
                        this.parent.showNextBookBanner();
                    }, 3900);
                }, 9400);

                video.addEventListener('ended', () => {
                    canvas.style.display = 'none';
                    poster.style.display = 'block';
                });
            });
        }
    }

}
