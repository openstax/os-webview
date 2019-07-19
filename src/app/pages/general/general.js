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

                // Making scripts work, per https://stackoverflow.com/a/47614491/392102
                Array.from(this.el.querySelectorAll('script'))
                    .forEach((s) => {
                        const newScript = document.createElement('script');

                        Array.from(s.attributes)
                            .forEach((a) => newScript.setAttribute(a.name, a.value));
                        newScript.appendChild(document.createTextNode(s.innerHTML));
                        s.parentNode.replaceChild(newScript, s);
                    });
            });
    }

}
