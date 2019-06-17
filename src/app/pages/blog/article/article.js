import componentType, {loaderMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './article.html';
import bodyUnitView from '~/components/body-units/body-units';
import css from './article.css';

const spec = {
    template,
    slug: 'set in init',
    preserveWrapping: true,
    view: {
        classes: ['article']
    },
    model() {
        const data = this.pageData;

        return data && {
            image: data.article_image,
            imageAlt: data.featured_image_alt_text,
            title: data.heading,
            subheading: data.subheading,
            author: data.author,
            date: data.date,
            tags: data.tags
        };
    }
};

export default class extends componentType(spec, loaderMixin) {

    attachUnits() {
        this.update();
        const bodyRegion = this.regionFrom('.body');

        this.pageData.body.forEach((unit) => {
            bodyRegion.append(bodyUnitView(unit));
        });
    }

    onLoaded() {
        if (this.pageData) {
            this.attachUnits();
        }
    }

    onDataLoaded() {
        this.hideLoader();
        if (this.el) {
            this.attachUnits();
        }
    }

}
