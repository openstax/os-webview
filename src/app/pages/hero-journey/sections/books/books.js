import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './books.html';
import css from './books.css';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    view: {
        classes: ['books', 'hero'],
        tag: 'section'
    },
    css
};

export default class extends componentType(spec, insertHtmlMixin) {

    init(model) {
        super.init();
        this.model = model;
    }

    @on('click [data-html="skipHtml"] a')
    complete(event) {
        this.model.onComplete();
        event.preventDefault();
    }

    @on('click .btn.primary')
    saveProgressBeforeLeaving(event) {
        this.model.onComplete();
    }

}
