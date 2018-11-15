import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './collapsing-pane.html';
import css from './collapsing-pane.css';

export default class CollapsingPane extends Controller {

    init(props) {
        this.template = template;
        this.props = props;
        this.view = {
            classes: ['collapsing-pane']
        };
        this.css = css;
        this.regions = {
            content: '.content-region'
        };
        this.model = () => this.getModel();

        this.isOpen = false;
    }

    getModel() {
        return {
            title: this.props.title,
            plusOrMinus: this.isOpen ? 'minus' : 'plus',
            hiddenAttribute: this.isOpen ? null : ''
        };
    }

    onLoaded() {
        if (this.props.contentComponent) {
            this.regions.content.attach(this.props.contentComponent);
        }
    }

    @on('click .control-bar')
    toggleOpen() {
        this.isOpen = !this.isOpen;
        this.update();
    }

}
