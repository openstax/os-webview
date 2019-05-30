import ArticleSummary from '../article-summary/article-summary';
import css from './pinned-article.css';

const spec = {
    css,
    view: {
        classes: ['pinned-article', 'boxed']
    }
};

export default class extends ArticleSummary {

    init(...args) {
        super.init(...args);
        Object.assign(this, spec);
    }

}
