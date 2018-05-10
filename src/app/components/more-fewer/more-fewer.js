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

    attachIndividualOrArray(contents, region) {
        if (contents instanceof Array) {
            contents.forEach((c) => {
                region.append(c);
            })
        } else {
            region.attach(contents);
        }
    }

    onLoaded() {
        this.attachIndividualOrArray(this.props.moreContents, this.regions.more);
        this.attachIndividualOrArray(this.props.fewerContents, this.regions.fewer);
    }

    @on('click .see')
    toggleShowing() {
        this.showing = this.notShowing;
        this.update();
    }

}
