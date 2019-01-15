import componentType, {canonicalLinkMixin, loaderMixin} from '~/helpers/controller/init-mixin';
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
const BaseClass = componentType(spec, canonicalLinkMixin, loaderMixin);

export default class Foundation extends BaseClass {

    static description = 'OpenStax is supported by our philanthropic ' +
        'sponsors like the Bill & Melinda Gates Foundation, the William and Flora ' +
        'Hewlett Foundation, and more.';

    onDataLoaded() {
        Object.assign(this.model, this.pageData);
        this.update();
        this.hideLoader();
    }

}
