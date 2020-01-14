import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './partners.html';
import css from './partners.css';
import {on} from '~/helpers/controller/decorators';
import routerBus from '~/helpers/router-bus';

const spec = {
    template,
    css,
    view: {
        classes: ['partners']
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

    @on('click .filter-for-book')
    saveBookInHistoryState(event) {
        const destUrl = event.delegateTarget.getAttribute('href');

        routerBus.emit('navigate', destUrl, {
            book: this.bookAbbreviation
        }, true);
    }

}
