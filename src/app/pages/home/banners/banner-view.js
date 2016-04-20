import BaseView from '~/helpers/backbone/view';
import seeThru from 'seeThru';

export default class BannerView extends BaseView {

    constructor(options) {
        super();

        this.parent = options.parent;
        this.name = options.name;
        this.display = options.display;
    }

    onRender() {
        this.video = seeThru.create(`.${this.name} .video`, {
            start: 'external'
        });

        if (this.display) {
            this.show();
        }
    }

    show() {
        let view = this;
        let el = this.el;
        let poster = el.querySelector('.video-banner');
        let noVideo = window.innerWidth < 780 ||
            (navigator.userAgent.indexOf('Safari') > -1 &&
            navigator.userAgent.indexOf('Chrome') === -1 &&
            navigator.userAgent.match(/(iPhone|iPod)/));

        el.style.display = 'block';

        if (!noVideo) {
            poster.style.display = 'none';

            let flyouts = el.querySelectorAll('.flyout');

            for (let flyout of flyouts) {
                flyout.classList.remove('flyout');
                flyout.classList.add('flyin');
            }

            this.video
            .ready((instance, video) => {
                video.addEventListener('timeupdate', () => {
                    if (video.duration - video.currentTime <= 0.75) {
                        let flyins = el.querySelectorAll('.flyin');

                        for (let flyin of flyins) {
                            flyin.classList.remove('flyin');
                            flyin.classList.add('flyout');
                        }
                    }
                });

                video.addEventListener('ended', () => {
                    // view.video.pause();
                    view.parent.showNextBanner();
                });

                view.video.play();
            });
        }
    }

    hide() {
        this.el.style.display = 'none';
    }

    onClose() {
        this.video.revert();
    }
}
