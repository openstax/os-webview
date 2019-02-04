import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './form-header.html';
import css from './form-header.css';

const spec = {
    template,
    css,
    view: {
        classes: ['form-header']
    },
    model() {
        return this.pageData ? {
            introHeading: this.pageData.intro_heading,
            introDescription: this.pageData.intro_description
        } : {};
    },
    slug: 'set in init'
};

export default class Header extends componentType(spec) {

    init(slug) {
        super.init();
        this.slug = slug;
    }

    onDataLoaded() {
        this.update();
        this.insertHtml();
    }

}
