import componentType from '~/helpers/controller/init-mixin';
import settings from 'settings';
import css from './general.css';

const spec = {
    view: {
        css,
        classes: ['general', 'page'],
        tag: 'main'
    }
};

export default class General extends componentType(spec) {

    init() {
        super.init();
        this.slug = window.location.pathname.substr(1).replace('general', 'spike');
    }

    onLoaded() {
        fetch(`${settings.apiOrigin}/api/${this.slug}`)
            .then((r) => r.text())
            .then((html) => {
                this.el.innerHTML = html;
            });
    }

}
