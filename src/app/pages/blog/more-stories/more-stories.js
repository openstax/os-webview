import componentType from '~/helpers/controller/init-mixin';
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

const spec = {
    template,
    css,
    view: {
        classes: ['more-stories']
    },
    regions: {
        cards: '.cards'
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        this.articles.forEach((model) => {
            delete model.subheading;
            this.regions.cards.append(new Card({model}));
        });
    }

}
