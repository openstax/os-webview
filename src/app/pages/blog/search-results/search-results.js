import MoreStories from '../more-stories/more-stories';
import {blurbModel} from '../article-summary/article-summary';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import uniqBy from 'lodash/uniqBy';

export default class extends MoreStories {

    refreshResults() {
        const searchParam = window.location.search.substr(1);
        const slug = `search/?q=${searchParam}`;

        fetchFromCMS(slug, true).then(
            (results) => {
                if (results.length === 0) {
                    this.regions.cards.el.textContent = 'No matching results were found.';
                    return;
                }
                this.articles = uniqBy(results, 'id')
                    .map((data) => {
                        data.heading = data.title;
                        return blurbModel(data.slug, data);
                    });
                this.loadArticles();
            },
            (err) => {
                console.warn(`Failed ${slug}:`, err);
            }
        );
    }

    onLoaded() {
        this.boundRR = () => this.refreshResults();
        window.addEventListener('popstate', this.boundRR);
        this.refreshResults();
    }

    onClose() {
        window.removeEventListener('popstate', this.boundRR);
    }

}
