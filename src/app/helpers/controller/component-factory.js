import CMSPageController from '~/controllers/cms';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';

const componentMixin = {
    init(options) {
        Object.assign(this, options);
    },
    regionFrom(el) {
        const Region = this.regions.self.constructor;

        return new Region(el, this);
    }
};

class CMSComponent extends CMSPageController {
}
Object.assign(CMSComponent.prototype, componentMixin);

class PlainComponent extends Controller {
}
Object.assign(PlainComponent.prototype, componentMixin);

const lookupConstructor = {
    cms: CMSComponent,
    plain: PlainComponent
};

export default function createComponent(controllerType, options) {
    const Constructor = lookupConstructor[controllerType];

    if (!Constructor) {
        throw new Error('No such controllerType');
    }
    return new Constructor(options);
}
