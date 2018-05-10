import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './press-mobile.html';

export default class PressMobile extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['press-mobile']
        };
        this.css = `/app/pages/press/press-mobile/press-mobile.css?${VERSION}`;
        this.model = () => this.getModel;
    }

    getModel() {
        this.props = this.getProps();

        console.debug("Returning", this.props);
        return this.props;
    }

}
