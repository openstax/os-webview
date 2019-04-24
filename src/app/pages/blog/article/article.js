import $ from '~/helpers/$';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import FormattedAs from './formatted-as/formatted-as';
import {Controller} from 'superb.js';
import {debounce} from 'lodash';
import css from './article.css';

function slugWithNewsPrefix(slug) {
    if (!(/^news\//).test(slug)) {
        return `news/${slug}`;
    }
    return slug;
}

export default class Article extends Controller {

    init(article, mode) {
        this.template = () => '';
        this.css = css;
        this.view = {
            classes: ['article']
        };
        this.articleSlug = slugWithNewsPrefix(article.slug);
        this.mode = mode;
        this.pinned = article.pin_to_top;
        this.formattedContent = null;
    }

    setMode(mode) {
        this.mode = mode;
        this.formattedContent = null;
        this.update();
    }

    populateArticleData() {
        return fetchFromCMS(this.articleSlug, true).then((data) => {
            this.pageData = data;
            this.update();
        });
    }

    setUpScrollHandler() {
        this.handleScroll = debounce(() => {
            if (!this.el) {
                return;
            }
            const r = this.el.getBoundingClientRect();

            if (r.height === 0) {
                setTimeout(this.handleScroll, 200);
                return;
            }
            if ($.overlapsViewport(this.el)) {
                window.removeEventListener('scroll', this.handleScroll);
                this.populateArticleData();
            }
        }, 200);

        window.addEventListener('scroll', this.handleScroll);
    }

    onClose() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    onLoaded() {
        this.setUpScrollHandler();
        this.handleScroll();
    }

    onUpdate() {
        const pageData = this.pageData;

        if (pageData && this.regions) {
            pageData.pinned = this.pinned;
            if (!this.formattedContent) {
                this.formattedContent = new FormattedAs(this.mode === 'page' ? 'feature' : 'synopsis', pageData);
            }
            this.regions.self.attach(this.formattedContent);
            this.fixEmbeddeds(Array.from(this.regions.self.el.querySelectorAll('embed')));
        }
    }

    fixEmbeddeds(embeds) {
        for (const embed of embeds) {
            embed.src = embed.getAttribute('url').replace('watch?v=', '/embed/');
            Object.assign(embed.style, {width: '640px', height: '480px'});
        }
    }

}
