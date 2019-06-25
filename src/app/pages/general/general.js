import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import settings from 'settings';
import css from './general.css';

const spec = {
    css,
    view: {
        classes: ['general', 'page'],
        tag: 'main'
    }
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
                const div = document.createElement('div');
                // Scripts have to be inserted as nodes, not as innerHTML, so swap
                // each of them out and back in
                Array.from(this.el.querySelectorAll('script'))
                    .forEach((s) => {
                        s.parentNode.replaceChild(div, s);
                        s.parentNode.replaceChild(s, div);
                    });
            });
    }

}
