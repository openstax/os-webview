import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './foundation.html';
import css from './foundation.css';

const spec = {
    template,
    css,
    view: {
        classes: ['foundation-page', 'page'],
        tag: 'main'
    },
    slug: 'pages/foundation',
    model: {
        title: '',
        'page_description': ''
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class Foundation extends BaseClass {

    onDataLoaded() {
        Object.assign(this.model, this.pageData);
        this.update();
    }

}
