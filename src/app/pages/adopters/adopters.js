import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import css from './adopters.css';
import {description as template} from './adopters.html';

const spec = {
    template,
    css,
    view: {
        classes: ['adopters-page', 'text-content'],
        tag: 'main'
    },
    model() {
        return {
            adopters: this.adopters
        };
    },
    slug: 'adopters'
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class Adopters extends BaseClass {

    onDataLoaded() {
        const results = this.pageData.results || this.pageData;

        this.adopters = results.sort((a, b) => a.name.localeCompare(b.name));
        this.update();
    }

}
