import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './partner.hbs';

@props({
    template,
    regions: {
        logo: '.logo'
    }
})
export default class Partner extends BaseView {
    constructor(templateHelpers) {
        super();
        this.templateHelpers = templateHelpers;
    }

    onRender() {
        this.el.classList.add('partner-info');
        if (this.templateHelpers.logoUrl) {
            let logoImg = document.createElement('IMG'),
                logoDiv = this.el.querySelector('.logo');

            logoImg.src = this.templateHelpers.logoUrl;
            logoDiv.appendChild(logoImg);
        }
    }
}
