import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import FormattedAs from './formatted-as/formatted-as';

function slugWithNewsPrefix(slug) {
    if (!(/^news\//).test(slug)) {
        return `news/${slug}`;
    }
    return slug;
}

export default class Article extends CMSPageController {

    init(article, mode) {
        this.template = () => '';
        this.css = `/app/pages/blog/article/article.css?${VERSION}`;
        this.view = {
            classes: ['article', 'hide-until-loaded']
        };
        this.slug = slugWithNewsPrefix(article.slug);
        this.pinned = article.pin_to_top;
        this.preserveWrapping = true;
    }

    setMode(mode) {
        this.mode = mode;
        this.update();
    }

    onDataLoaded() {
        if (this.el) {
            this.update();
            this.el.classList.add('loaded');
        }
    }

    onUpdate() {
        if (this.pageData && this.regions) {
            this.pageData.pinned = this.pinned;
            const formattedContent = new FormattedAs(this.mode === 'page' ? 'feature' : 'synopsis', this.pageData);

            this.regions.self.attach(formattedContent);
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
