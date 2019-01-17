import componentType from '~/helpers/controller/init-mixin';
import mix from '~/helpers/controller/mixins';

export default function (spec, ...mixins) {
    return function (modelSpec) {
        const fullSpec = Object.assign({}, spec, modelSpec);
        const BaseClass = mix(componentType(fullSpec)).with(...mixins);

        return new BaseClass();
    };
}

export function insertHtmlMixin(superclass) {
    return class extends superclass {

        onUpdate() {
            this.insertHtml();
        }

    };
}
