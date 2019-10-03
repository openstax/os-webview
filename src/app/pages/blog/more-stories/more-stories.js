import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import SearchBar from '../search-bar/search-bar';
import ArticleSummary from '../article-summary/article-summary';
import css from './more-stories.css';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import {description as template} from './more-stories.html';

const cardSpec = {
    view: {
        classes: ['card']
    }
};

class Card extends ArticleSummary {

    init(...args) {
        super.init(...args);
        Object.assign(this, cardSpec);
    }

}

export function loadArticles(region, articles) {
    region.empty();
    articles.forEach((model) => {
        delete model.subheading;
        region.append(new Card({model}));
    });
}

const spec = {
    template,
    css,
    view: {
        classes: ['more-stories']
    },
    regions: {
        searchbar: '.searchbar',
        cards: '.cards'
    }
};

export default class extends componentType(spec, busMixin) {

    onLoaded() {
        const sb = new SearchBar();

        sb.on('value', (...args) => this.emit('value', ...args));
        this.regions.searchbar.attach(sb);
        loadArticles(this.regions.cards, this.articles);
    }

}
