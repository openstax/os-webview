import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './about.html';
import css from './about.css';
import {on} from '~/helpers/controller/decorators';
import shellBus from '~/components/shell/shell-bus';
import $ from '~/helpers/$';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        classes: ['about']
    }
};

const dialogContent = new (componentType({
    view: {
        classes: ['info-box']
    }
}))();

export default class extends componentType(spec, insertHtmlMixin) {

    @on('click .navigator a')
    showLinkInDialog(event) {
        const target = event.delegateTarget;
        const url = target.href;
        const title = target.textContent;

        event.preventDefault();
        fetch(url).then((r) => r.text()).then((html) => {
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            const destEl = dialogContent.regions.self.el;

            destEl.innerHTML = '';
            Array.from(newDoc.body.children).forEach((child) => {
                destEl.appendChild(child);
            });
            $.activateScripts(destEl);
            shellBus.emit('showDialog', () => ({
                title,
                content: dialogContent
            }));
        });
    }

    @on('click .down-page')
    scrollToLastSection(event) {
        const lastSection = Array.from(document.querySelectorAll('section')).pop();

        $.scrollTo(lastSection);
        event.delegateTarget.blur();
        event.preventDefault();
    }

}
