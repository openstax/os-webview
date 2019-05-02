import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './press-excerpt.html';
import css from './press-excerpt.css';

const spec = {
    template,
    css,
    view: {
        classes: ['press-excerpt']
    },
    model() {
        return {
            iconUrl: this.props.iconUrl,
            author: this.props.author,
            source: this.props.source,
            org: this.props.org,
            date: this.props.date,
            headline: this.props.headline,
            excerpt: this.props.excerpt,
            url: this.props.url
        };
    }
};

export default class PressExcerpt extends componentType(spec) {

    init(props) {
        super.init();
        this.props = props;
    }

    onLoaded() {
        if (this.props.iconUrl) {
            this.el.classList.add('with-icon');
        }
    }

}
