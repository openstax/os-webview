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

    @on('click .down-page')
    scrollToLastSection(event) {
        const lastSection = Array.from(document.querySelectorAll('section')).pop();

        $.scrollTo(lastSection);
        event.delegateTarget.blur();
        event.preventDefault();
    }

}
