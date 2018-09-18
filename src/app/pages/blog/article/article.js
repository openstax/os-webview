import VERSION from '~/version';
import $ from '~/helpers/$';
import CMSPageController from '~/controllers/cms';
import FormattedAs from './formatted-as/formatted-as';
import {Controller} from 'superb.js';
import {debounce} from 'lodash';

function slugWithNewsPrefix(slug) {
    if (!(/^news\//).test(slug)) {
        return `news/${slug}`;
    }
    return slug;
}

class ArticleContent extends CMSPageController {

    init(slug, dataLoadedCallback) {
        this.template = () => '';
        this.slug = slug;
        this.preserveWrapping = true;
        this.dataLoadedCallback = dataLoadedCallback;
    }

    onDataLoaded() {
        this.dataLoadedCallback(this.pageData);
    }

}

export default class Article extends Controller {

    init(article, mode) {
        this.template = () => '';
        this.css = `/app/pages/blog/article/article.css?${VERSION}`;
        this.view = {
            classes: ['article']
        };
        this.slug = slugWithNewsPrefix(article.slug);
        this.mode = mode;
        this.pinned = article.pin_to_top;
        this.formattedContent = null;
    }

    setMode(mode) {
        this.mode = mode;
        this.formattedContent = null;
        this.update();
    }

    setUpScrollHandler() {
        this.handleScroll = debounce(() => {
            const r = this.el.getBoundingClientRect();

            if (r.height === 0) {
                setTimeout(this.handleScroll, 200);
                return;
            }
            if ($.overlapsViewport(this.el)) {
                /* eslint no-new: 0 */
                new ArticleContent(this.slug, (pageData) => {
                    this.pageData = pageData;
                    if (this.el) {
                        this.update();
                    }
                });
                window.removeEventListener('scroll', this.handleScroll);
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
