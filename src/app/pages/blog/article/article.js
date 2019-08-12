import componentType, {loaderMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './article.html';
import bodyUnitView from '~/components/body-units/body-units';
import css from './article.css';
import Byline from '../byline/byline';

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
            tags: data.tags
        };
    }
};

export default class extends componentType(spec, loaderMixin) {

    attachUnits() {
        this.update();
        const bodyRegion = this.regionFrom('.body');
        const bylineRegion = this.regionFrom('.byline');

        this.pageData.body.forEach((unit) => {
            bodyRegion.append(bodyUnitView(unit));
        });
        bylineRegion.attach(new Byline({
            date: this.pageData.date,
            author: this.pageData.author
        }));
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        if (this.pageData) {
            this.attachUnits();
        }
    }

    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        this.hideLoader();
        if (this.el) {
            this.attachUnits();
        }
    }

}
