import $ from '~/helpers/$';
import {Controller} from 'superb.js';
import CMSPageController from '~/controllers/cms';
import mix from './mixins';
import shell from '~/components/shell/shell';

const componentMixin = (superclass) => class extends superclass {

    init(options) {
        Object.assign(this, options);
        if (typeof this.model === 'function') {
            this.model = this.model.bind(this);
        }
    }

    template() {}

    regionFrom(source) {
        const Region = this.regions.self.constructor;
        const el = typeof source === 'string' ? this.el.querySelector(source) : source;

        return new Region(el, this);
    }

    insertHtml() {
        $.insertHtml(this.el, this.model);
    }

};

function mixinFromSpec(spec) {
    const specMixin = (superclass) => class extends superclass {

        init(options) {
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

export function loaderMixin(superclass) {
    return class extends superclass {

        init(...args) {
            if (super.init) {
                super.init(...args);
            }
            shell.showLoader();
        }

        hideLoader() {
            shell.hideLoader();
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
