import componentType, {canonicalLinkMixin, loaderMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './footer-page.html';
import css from './footer-page.css';

const spec = {
    template,
    css,
    view: {
        classes: ['footer-page', 'page']
    },
    slug: `pages${window.location.pathname}`
};
const BaseClass = componentType(spec, canonicalLinkMixin, loaderMixin);

export default class FooterPage extends BaseClass {

    onDataLoaded() {
        document.title = this.pageData.title;
        const contentFieldName = Reflect.ownKeys(this.pageData).find((k) => k.match(/_content$/));

        this.model = {
            heading: this.pageData.intro_heading,
            content: this.pageData[contentFieldName]
        };
        this.insertHtml();
        this.hideLoader();
    }

}
