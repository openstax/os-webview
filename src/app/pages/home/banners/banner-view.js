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

        el.classList.add('fadein');

        setTimeout(() => {
            el.classList.remove('fadein');

            setTimeout(() => {
                this.parent.showNextBanner();
            }, 200);
        }, 8000);
    }

    hide() {}
}
