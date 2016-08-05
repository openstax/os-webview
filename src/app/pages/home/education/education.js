import {Controller} from 'superb';
import {description as template} from './education.html';

export default class Education extends Controller {

    init(model) {
        this.template = template;
        this.css = '/app/pages/home/education/education.css';
        this.model = model;
        this.view = {
            classes: ['education-banner']
        };
    }

    onLoaded() {
        for (const el of this.el.querySelectorAll('[data-html-content]')) {
            const index = el.dataset.htmlContent;

            el.innerHTML = this.model[index].content;
        }
    }

}
