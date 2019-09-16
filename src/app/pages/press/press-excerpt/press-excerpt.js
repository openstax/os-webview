import componentType from '~/helpers/controller/init-mixin';
import Byline from '~/components/byline/byline';
import {description as template} from './press-excerpt.html';
import css from './press-excerpt.css';

const spec = {
    template,
    css,
    view: {
        classes: ['press-excerpt']
    },
    model() {
        return {
            iconUrl: this.iconUrl,
            author: this.author,
            source: this.source,
            org: this.org,
            date: this.date,
            headline: this.headline,
            excerpt: this.excerpt,
            url: this.url
        };
    }
};

export default class PressExcerpt extends componentType(spec) {

    onLoaded() {
        if (this.iconUrl) {
            this.el.classList.add('with-icon');
        }

        const bylineRegion = this.regionFrom('.byline');

        bylineRegion.attach(new Byline({
            date: this.date,
            author: this.author,
            source: this.source
        }));
    }

}
