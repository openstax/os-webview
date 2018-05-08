import VERSION from '~/version';
import $ from '~/helpers/$';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './more-fewer.html';

export default class MoreFewer extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['more-fewer']
        };
        this.regions = {
            fewer: '.fewer',
            more: '.more'
        };
        this.css = `/app/components/more-fewer/more-fewer.css?${VERSION}`;
        this.model = () => this.getModel();
        this.showing = 'fewer';
    }

    get notShowing() {
        return this.showing === 'fewer' ? 'more' : 'fewer';
    }

    getModel() {
        this.props = this.getProps();

        return {
            showing: this.showing,
            notShowing: this.notShowing,
            items: this.props.items,
            fewerHidden: $.booleanAttribute(this.notShowing === 'fewer'),
            moreHidden: $.booleanAttribute(this.notShowing === 'more')
        };
    }

    onLoaded() {
        this.regions.more.attach(this.props.moreContent);
        this.regions.fewer.attach(this.props.fewerContent);
    }

    @on('click .see')
    toggleShowing() {
        this.showing = this.notShowing;
        this.update();
    }

}
