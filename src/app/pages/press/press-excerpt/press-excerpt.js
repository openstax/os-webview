import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './press-excerpt.html';

export default class PressExcerpt extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['press-excerpt']
        };
        this.css = `/app/pages/press/press-excerpt/press-excerpt.css?${VERSION}`;
        this.model = () => this.getModel();
    }

    getModel() {
        this.props = this.getProps();

        return {
            iconUrl: this.props.iconUrl,
            author: this.props.author,
            org: this.props.org,
            date: this.props.date,
            headline: this.props.headline,
            excerpt: this.props.excerpt,
            externalLink: this.props.externalLink
        };
    }

    onLoaded() {
        if (this.props.iconUrl) {
            this.el.classList.add('with-icon');
        }
    }

}
