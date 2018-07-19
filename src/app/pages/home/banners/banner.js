import {Controller} from 'superb.js';
import {description as template} from './banner.html';

export default class Banner extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.model.fly = 'out';
        this.view = {
            classes: ['banner', model.subject]
        };
    }

    show() {
        this.el.classList.add('fadein');
        this.model.fly = 'in';
        this.update();
    }

    hide() {
        this.model.fly = 'out';
        this.update();
        return new Promise((resolve) => {
            this.flyTimer = setTimeout(() => {
                this.el.classList.remove('fadein');
                resolve();
            }, 400);
        });
    }

    onClose() {
        clearTimeout(this.flyTimer);
    }

}
