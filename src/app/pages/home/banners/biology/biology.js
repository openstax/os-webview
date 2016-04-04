import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './biology.hbs';
import seeThru from 'seeThru';

@props({
    template: template
})
export default class Biology extends BaseView {

    onRender() {
        let poster = this.el.querySelector('.video-banner');
        let noVideo = window.innerWidth < 780 ||
            (navigator.userAgent.indexOf('Safari') > -1 &&
            navigator.userAgent.indexOf('Chrome') === -1 &&
            navigator.userAgent.match(/(iPhone|iPod)/));

        if (!noVideo) {
            seeThru.create('.video')
            .ready((instance, video, canvas) => {
                poster.style.display = 'none';

                video.addEventListener('ended', () => {
                    canvas.style.display = 'none';
                    poster.style.display = 'block';
                });
            });
        }
    }

}
