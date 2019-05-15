import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './hero.html';
import css from './hero.css';

const spec = {
    template,
    css,
    view: {
        classes: ['hero']
    },
    model: {
        instructions: 'Errata submissions are displayed below until a new PDF is published online.',
        moreAbout: 'More about our correction schedule',
        errataHoverHtml: '<p>...loading...</p>'
    },
    slug: 'pages/errata'
};

export default class extends componentType(spec, insertHtmlMixin) {

    init(modelData) {
        super.init();
        Object.assign(this.model, modelData);
    }

    onDataLoaded() {
        this.model.errataHoverHtml = this.pageData.correction_schedule;
        this.update();
    }

}
