import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './fetched-content.html';
import css from './fetched-content.css';
import $ from '~/helpers/$';

const spec = {
    template,
    css,
    get view() {
        return {
            tag: 'section'
        };
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        this.el.classList.add(this.pageId);
        fetch(this.url).then((r) => r.text()).then((html) => {
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            const destEl = this.el.querySelector('.boxed');

            destEl.innerHTML = '';
            Array.from(newDoc.body.children).forEach((child) => {
                destEl.appendChild(child);
            });
            $.activateScripts(destEl);
        });
    }

}
