import {Controller} from 'superb';
import {description as template} from './partner.html';

export default class Partner extends Controller {

    init(templateHelpers) {
        this.template = template;
        this.view = {
            classes: ['partner-info']
        };
        this.regions = {
            logo: '.logo'
        };
        this.templateHelpers = templateHelpers; // FIX: This isn't how to use templateHelpers
    }

    onLoaded() {
        // FIX: Move all of this to the template
        if (this.templateHelpers.logoUrl) {
            const logoImg = document.createElement('IMG');
            const logoDiv = this.el.querySelector('.logo');

            logoImg.src = this.templateHelpers.logoUrl;
            logoDiv.appendChild(logoImg);
        }
    }

}
