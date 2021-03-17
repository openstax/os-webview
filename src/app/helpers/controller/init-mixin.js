import $ from '~/helpers/$';
import {Controller} from 'superb.js';
import CMSPageController from '~/controllers/cms';
import mix from './mixins';
import shellBus from '~/components/shell/shell-bus';
import debounce from 'lodash/debounce';

const updateOptimizely = debounce(() => {
    if (window.dataLayer) {
        window.dataLayer.push({event: 'optimize.activate'});
    }
}, 80);

const componentMixin = (superclass) => class extends superclass {

    init(options) {
        Object.assign(this, options);
        if (this.model instanceof Function) {
            this.model = this.model.bind(this);
        }
    }

    template() {}

    regionFrom(source) {
        const Region = this.regions.self.constructor;
        const el = typeof source === 'string' ? this.el.querySelector(source) : source;

        return new Region(el, this);
    }

    insertHtml(el=this.el, model=this.model) {
        $.insertHtml(el, model);
    }

    onLoaded() {
        updateOptimizely();
    }

    detach(...args) {
        const el = this.el;

        super.detach(...args);
        if (el) {
            el.remove();
        }
    }

};

function mixinFromSpec(spec) {
    const specMixin = (superclass) => class extends superclass {

        init(options) {
            if ((spec || {}).data instanceof Function) {
                Object.assign(this, spec.data());
            }
            Object.assign(this, spec);
            super.init(options);
        }

    };

    return specMixin;
}

export function canonicalLinkMixin(superclass) {
    return class extends superclass {

        init(...args) {
            if (super.init) {
                super.init(...args);
            }
            this.canonicalLink = $.setCanonicalLink();
        }

        setCanonicalLink(newPath) {
            $.setCanonicalLink(newPath, this.canonicalLink);
        }

        onClose() {
            if (super.onClose) {
                super.onClose();
            }
            if (this.canonicalLink) {
                this.canonicalLink.remove();
            } else {
                throw new Error('Canonical link was not set (probably forgot to call super in init)');
            }
        }

    };
}

const CMSComponent = mix(CMSPageController).with(componentMixin);
const PlainComponent = mix(Controller).with(componentMixin);

export default function componentType(spec, ...mixins) {
    const BaseClass = 'slug' in spec ? CMSComponent : PlainComponent;
    const mixin = mixinFromSpec(spec);

    return mix(BaseClass).with(mixin, ...mixins);
}
