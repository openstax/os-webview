import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import {props} from '~/helpers/backbone/decorators';
import {template} from './ally.hbs';

class LogoModel extends BaseModel {
    constructor(urlRoot) {
        super();
        this.urlRoot = urlRoot;
    }
}

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
        this.el.classList.add('ally-info', 'resource');
        if (this.templateHelpers.logoUrlUrl) {
            let logoImg = document.createElement('IMG'),
                logoDiv = this.el.querySelector('.logo');

            new LogoModel(this.templateHelpers.logoUrlUrl).fetch().then((data) => {
                logoImg.src = data.file;
                logoDiv.appendChild(logoImg);
            });
        }
    }
}
