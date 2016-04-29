import BaseView from '~/helpers/backbone/view';

export default class BannerView extends BaseView {

    constructor(options) {
        super();

        this.parent = options.parent;
        this.name = options.name;
        this.display = options.display;
    }

    onRender() {
        if (this.display) {
            this.show();
        }
    }

    show() {
        let el = this.el;
        let flyouts = el.querySelectorAll('.flyout');

        el.classList.add('fadein');

        for (let flyout of flyouts) {
            flyout.classList.remove('flyout');
            flyout.classList.add('flyin');
        }


        setTimeout(() => {
            let flyins = el.querySelectorAll('.flyin');

            for (let flyin of flyins) {
                flyin.classList.remove('flyin');
                flyin.classList.add('flyout');
            }

            setTimeout(() => {
                this.parent.showNextBanner();
            }, 300);
        }, 8000);
    }

    hide() {
        this.el.classList.remove('fadein');
    }
}
