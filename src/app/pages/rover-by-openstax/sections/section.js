import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import mix from '~/helpers/controller/mixins';

export default function (spec, ...mixins) {
    return function (modelSpec) {
        const fullSpec = Object.assign({}, spec, modelSpec);
        const BaseClass = mix(componentType(fullSpec)).with(insertHtmlMixin, ...mixins);

        return new BaseClass();
    };
}
