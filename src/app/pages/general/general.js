import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import css from './general.css';
import $ from '~/helpers/$';
import {urlFromSlug} from '~/models/cmsFetch';

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
        fetch(urlFromSlug(this.slug))
            .then((r) => r.text())
            .then((html) => {
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(html, 'text/html');
                const strips = parser
                    .parseFromString(
                        '<img class="strips" src="/images/components/strips.svg" height="10" alt="">',
                        'text/html'
                    )
                    .querySelector('img');

                Array.from(newDoc.body.children).forEach((child) => {
                    this.el.appendChild(child);
                    if (child.classList.contains('block-heading')) {
                        child.appendChild(strips);
                    }
                });
                $.activateScripts(this.el);
            });
    }

}
