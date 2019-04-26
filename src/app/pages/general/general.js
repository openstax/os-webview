import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import settings from 'settings';
import css from './general.css';

const spec = {
    css,
    view: {
        classes: ['general', 'page'],
        tag: 'main'
    },
    slug: ''
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class General extends BaseClass {

    init() {
        super.init();
        this.slug = window.location.pathname.substr(1).replace('general', 'spike');
    }

    onLoaded() {
        fetch(`${settings.apiOrigin}${settings.apiPrefix}/${this.slug}`)
            .then((r) => r.text())
            .then((html) => {
                this.el.innerHTML = html;
            });
    }

}
