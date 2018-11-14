import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import CMSPageController from '~/controllers/cms';

const componentMixin = {
    init(options) {
        Object.assign(this, options);
        if (typeof this.model === 'function') {
            this.model = this.model.bind(this);
        }
    },
    template() {},
    regionFrom(source) {
        const Region = this.regions.self.constructor;
        const el = typeof source === 'string' ? this.el.querySelector(source) : source;

        return new Region(el, this);
    },
    insertHtml() {
        $.insertHtml(this.el, this.model);
    }
};

class CMSComponent extends CMSPageController {}
class PlainComponent extends Controller {}
Object.assign(CMSComponent.prototype, componentMixin);
Object.assign(PlainComponent.prototype, componentMixin);

export default function componentType(spec) {
    const BaseClass = 'slug' in spec ? CMSComponent : PlainComponent;

    class NewClass extends BaseClass {

        init(options) {
            Object.assign(this, spec);
            super.init(options);
        }

    };
    return NewClass;
}
