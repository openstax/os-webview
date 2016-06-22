import {Controller} from 'superb';

export default class BannerView extends Controller {

    constructor(options) {
        super();

        this.parent = options.parent;
        this.name = options.name;
        this.display = options.display;
    }

    onLoaded() {
        if (this.display) {
            this.show();
        }
    }

    show() {
        const el = this.el;
        const flyouts = el.querySelectorAll('.flyout');

        el.classList.add('fadein');

        for (const flyout of flyouts) {
            flyout.classList.remove('flyout');
            flyout.classList.add('flyin');
        }


        this.flyinTimer = setTimeout(() => {
            const flyins = el.querySelectorAll('.flyin');

            for (const flyin of flyins) {
                flyin.classList.remove('flyin');
                flyin.classList.add('flyout');
            }

            this.nextBannerTimer = setTimeout(() => {
                this.parent.showNextBanner();
            }, 300);
        }, 11000);
    }

    hide() {
        this.el.classList.remove('fadein');
    }

    onClose() {
        clearTimeout(this.flyinTimer);
        clearTimeout(this.nextBannerTimer);
    }

}
