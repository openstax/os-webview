import LoadingView from '~/helpers/backbone/loading-view';
import settings from 'settings';
import {props} from '~/helpers/backbone/decorators';
import {template} from './blog.hbs';
import Articles from './articles/articles';
import PinnedArticle from './pinned-article/pinned-article';
import newsPromise from './newsPromise';

@props({
    template: template,
    css: '/app/pages/blog/blog.css',
    templateHelpers: () => {
        let loginLink = `${settings.apiOrigin}/accounts/login/openstax/?next=`;
        let nextLink = `${settings.apiOrigin}/faculty-verification`;

        return {
            loginLink: `${loginLink}${nextLink}`
        };
    },
    regions: {
        articles: '.articles',
        pinned: '.pinned'
    }
})
export default class Blog extends LoadingView {
    onLoaded() {
        super.onLoaded();
        this.el.querySelector('.blog.page').classList.remove('hidden');
        document.body.classList.remove('no-scroll');
    }

    onRender() {
        document.body.classList.add('no-scroll');
        this.el.querySelector('.blog.page').classList.add('hidden');

        newsPromise.then((newsData) => {
            let excludeTitle;

            for (let article of newsData.pages) {
                if (article.pin_to_top) {
                    excludeTitle = article.slug;
                    this.regions.pinned.append(new PinnedArticle(article));
                }
            }
            this.regions.articles.append(new Articles(excludeTitle));
        });
        super.onRender();
    }
}
