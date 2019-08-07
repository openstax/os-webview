import componentType from '~/helpers/controller/init-mixin';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import css from './search-results.css';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import uniqBy from 'lodash/uniqBy';

const spec = {
    css,
    view: {
        classes: ['search-results']
    }
};

const resultSpec = {
    view: {
        classes: ['result']
    }
};

export default class extends componentType(spec) {

    refreshResults() {
        const searchParam = window.location.search.substr(1);
        const slug = `search/?q=${searchParam}`;

        fetchFromCMS(slug, true).then(
            (results) => {
                this.regions.self.empty();
                if (results.length === 0) {
                    this.regions.self.el.textContent = 'No matching results were found.';
                    return;
                }
                uniqBy(results, 'id').forEach((data) => {
                    data.heading = data.title;
                    this.regions.self.append(new ArticleSummary(
                        Object.assign({model: blurbModel(data.slug, data)}, resultSpec)
                    ));
                });
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
