import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import {props} from '~/helpers/backbone/decorators';
import {template} from './ally.hbs';

@props({
    template: () => '<img />',
    regions: {
        img: 'img'
    }
})
class Logo extends BaseView {
    constructor(logoUrlUrl) {
        super();
        this.logoUrlPromise = new BaseModel({url: logoUrlUrl}).fetch();
    }

    onRender() {
        this.logoUrlPromise.then((data) => {
            console.debug('logourl should be here', data);
            this.regions.img.src = data.file;
        });
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
        if (templateHelpers.logoUrlUrl) {
            this.regions.logo.show(new Logo(templateHelpers.logoUrlUrl));
        }
    }

    onRender() {
        this.el.classList.add('ally-info');
    }
}
