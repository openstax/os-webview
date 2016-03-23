import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './ally.hbs';

@props({
    template,
    regions: {
        logo: '.logo'
    }
})
export default class Ally extends BaseView {
    constructor(templateHelpers) {
        super();
        this.templateHelpers = templateHelpers;
    }

    onRender() {
        this.el.classList.add('ally-info');
        if (this.templateHelpers.logoUrl) {
            let logoImg = document.createElement('IMG'),
                logoDiv = this.el.querySelector('.logo');

            logoImg.src = this.templateHelpers.logoUrl;
            logoDiv.appendChild(logoImg);
        }
    }
}
