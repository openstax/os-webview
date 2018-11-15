import {Controller} from 'superb.js';
import {description as template} from './toc-pane.html';
import css from './toc-pane.css';

export default class TocPane extends Controller {

    init(props) {
        this.template = template;
        this.props = props;
        this.view = {
            classes: ['toc-pane']
        };
        this.regions = {
            toc: '.toc-region'
        };
        this.css = css;
        this.model = () => this.getModel();
    }

    getModel() {
        return {
            polish: this.props.polish,
            webviewLink: this.props.webviewLink
        };
    }

    onLoaded() {
        this.regions.toc.attach(this.props.contentPane);
    }

}
