import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './footer-page.html';
import css from './footer-page.css';

const spec = {
    template,
    css,
    view: {
        classes: ['footer-page', 'page']
    },
    slug: 'set in init'
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class FooterPage extends BaseClass {

    init(...args) {
        super.init(...args);
        this.slug = `pages${window.location.pathname}`;
    }

    onDataLoaded() {
        document.title = this.pageData.title;
        const contentFieldName = Reflect.ownKeys(this.pageData).find((k) => k.match(/_content$/));

        this.model = {
            heading: this.pageData.intro_heading,
            content: this.pageData[contentFieldName]
        };
        this.insertHtml();
    }

}
