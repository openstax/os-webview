import {Controller} from 'superb.js';
import {description as template} from './content-group.html';

export default class ContentGroup extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.updateProps();
        this.view = {
            classes: ['content-group']
        };
    }

    onLoaded() {
        const Region = this.regions.self.constructor;

        for (const target of this.el.children) {
            const region = new Region(target, this);

            region.attach(this.model.contents[target.getAttribute('data-for-tab')]);
        }
    }

    updateProps() {
        this.props = this.getProps();
        this.model = {
            isHidden: (tab) => tab === this.props.selectedTab ? null : '',
            contents: this.props.contents
        };
    }

    update() {
        this.updateProps();
        super.update();
    }

}
