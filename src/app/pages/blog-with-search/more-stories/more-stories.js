import componentType from '~/helpers/controller/init-mixin';
import ArticleSummary from '../article-summary/article-summary';
import css from './more-stories.css';

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
    css,
    view: {
        classes: ['more-stories', 'boxed']
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        this.articles.forEach((model) => {
            delete model.subheading;
            this.regions.self.append(new Card({model}));
        });
    }

}
