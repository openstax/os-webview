import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './members-tab.html';

export default class MembersTab extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['members-tab']
        };
        this.css = `/app/pages/research/members-tab/members-tab.css?${VERSION}`;
        this.model = () => this.getModel();
    }

    getModel() {
        this.props = this.getProps();

        return this.props;
    }

}
