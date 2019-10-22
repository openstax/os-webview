import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './search-results.html';
import css from './search-results.css';
import {loadArticles} from '../more-stories/more-stories';
import Paginator from '~/components/paginator/paginator';
import {blurbModel} from '../article-summary/article-summary';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import uniqBy from 'lodash/uniqBy';

const RESULTS_PER_PAGE = 10;
const spec = {
    template,
    css,
    view: {
        classes: ['search-results']
    },
    regions: {
        cards: '.cards',
        paginator: '.paginator'
    },
    currentPage: 0,
    allArticles: []
};

export default class extends componentType(spec) {


    get firstIndex() {
        return this.currentPage * RESULTS_PER_PAGE;
    }

    get endBefore() {
        return Math.min(this.firstIndex + RESULTS_PER_PAGE, this.allArticles.length);
    }

    get articles() {
        return this.allArticles.slice(this.firstIndex, this.endBefore);
    }

    refreshResults() {
        const searchParam = window.location.search.substr(1);
        const slug = `search/?q=${searchParam}`;

        fetchFromCMS(slug, true).then(
            (results) => {
                if (results.length === 0) {
                    this.regions.cards.el.textContent = 'No matching results were found.';
                    return;
                }
                this.allArticles = uniqBy(results, 'id')
                    .map((data) => {
                        data.heading = data.title;
                        return blurbModel(data.slug, data);
                    });
                loadArticles(this.regions.cards, this.articles, false);
                this.updatePaginator({
                    searchTerm: decodeURIComponent(searchParam),
                    resultRange: `${this.firstIndex + 1}-${this.endBefore}`,
                    totalResults: this.allArticles.length,
                    pages: Math.ceil(this.allArticles.length / RESULTS_PER_PAGE),
                    currentPage: this.currentPage + 1
                });
            },
            (err) => {
                console.warn(`Failed ${slug}:`, err);
            }
        );
    }

    updatePaginator(props) {
        if (!this.paginator) {
            this.paginator = new Paginator(Object.assign({
                el: this.regions.paginator.el
            }, props));
            this.paginator.on('change', (newPage) => {
                this.currentPage = newPage - 1;
                this.paginator.emit('update-props', {
                    currentPage: this.currentPage + 1,
                    resultRange: `${this.firstIndex + 1}-${this.endBefore}`
                });
                loadArticles(this.regions.cards, this.articles, false);
            });
        } else {
            this.paginator.emit('update-props', props);
        }
    }

    onLoaded() {
        this.refreshResults();
    }

}
