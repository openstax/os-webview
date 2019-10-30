import $ from '~/helpers/$';
import {Controller} from 'superb.js';
import CMSPageController from '~/controllers/cms';
import mix from './mixins';
import shellBus from '~/components/shell/shell-bus';
import debounce from 'lodash/debounce';

const updateOptimizely = debounce(() => {
    if (dataLayer) {
        dataLayer.push({event: 'optimize.activate'});
    }
}, 80);

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

export function insertHtmlMixin(superclass) {
    return class extends superclass {

        onUpdate() {
            if (super.onUpdate) {
                super.onUpdate();
            }
            this.insertHtml();
        }

    };
}

// utilities for flattenPageDataMixin
function camelCase(underscored) {
    return underscored.replace(/_([a-z])/g, (_, chr) => chr ? chr.toUpperCase() : '');
}

function camelCaseKeys(obj) {
    if (!(obj instanceof Object)) {
        return obj;
    }

    if (obj instanceof Array) {
        return obj.map((v) => camelCaseKeys(v));
    }

    const result = {};

    Reflect.ownKeys(obj).forEach((k) => {
        result[camelCase(k)] = camelCaseKeys(obj[k]);
    });

    return result;
}


export function flattenPageDataMixin(superclass) {
    return class extends superclass {

        flattenPageData() {
            const result = {};

            Reflect.ownKeys(this.pageData)
                .filter((k) => this.pageData[k] instanceof Array)
                .forEach((k) => {
                    const values = this.pageData[k];
                    const newEntry = {};

                    values.forEach((v) => {
                        newEntry[camelCase(v.type)] = camelCaseKeys(v.value);
                    });

                    result[camelCase(k)] = newEntry;
                });

            return result;
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
