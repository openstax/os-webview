import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './article-summary.html';
import debounce from 'lodash/debounce';
import $ from '~/helpers/$';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import Byline from '../byline/byline';

const spec = {
    template,
    regions: {
        byline: '.byline'
    }
};

export function blurbModel(articleSlug, data) {
    if (!data) {
        return {};
    }
    return {
        headline: data.heading,
        subheading: data.subheading,
        image: data.article_image,
        altText: data.article_image_alt,
        body: data.body_blurb,
        author: data.author,
        date: data.date,
        articleSlug
    };
}

export default class ArticleSummary extends componentType(spec, insertHtmlMixin) {

    init(...args) {
        super.init(...args);
        const savedImage = this.model.image;

        this.model.image = '';
        this.handleScroll = debounce(() => {
            if (!this.el) {
                return;
            }
            if ($.overlapsViewport(this.el)) {
                window.removeEventListener('scroll', this.handleScroll);
                this.model.image = savedImage;
                this.update();
            }
        }, 200);
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.regions.byline.attach(new Byline({
            date: this.model.date,
            author: this.model.author
        }));
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
    }

}
