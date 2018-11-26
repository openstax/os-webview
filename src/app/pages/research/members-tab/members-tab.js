import {Controller} from 'superb.js';
import {description as template} from './members-tab.html';
import css from './members-tab.css';

export default class MembersTab extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['members-tab']
        };
        this.css = css;
        this.model = () => this.getModel();
    }

    getModel() {
        this.props = this.getProps();

        return this.props;
    }

}
