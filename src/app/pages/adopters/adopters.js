import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import {props} from '~/helpers/backbone/decorators';
import {template} from './adopters.hbs';
import settings from 'settings';

let adopterPromise = (new BaseModel()).fetch({url: `${settings.apiOrigin}/api/adopters`});

class AdopterView extends BaseView {
    constructor(name) {
        super();
        this.template = name;
    }

    onRender() {
        this.el.classList.add('adopter');
    }
}

@props({
    template,
    regions: {
        adopters: '.adopters'
    }
})
export default class Adopters extends BaseView {
    onRender() {
        this.el.classList.add('adopters-page', 'text-content');
        adopterPromise.then((data) => {
            let sortedNames = data.map((obj) => obj.name).sort();

            for (let name of sortedNames) {
                let view = new AdopterView(name);

                this.regions.adopters.append(view);
            }
        });
    }
}
