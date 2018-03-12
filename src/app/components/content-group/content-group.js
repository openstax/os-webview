import VERSION from '~/version';
import {Controller} from 'superb.js';

export default class ContentGroup extends Controller {

    init(getProps) {
        this.getProps = getProps;
        this.view = {
            classes: ['content-group']
        };
        this.css = `/app/components/content-group/content-group.css?${VERSION}`;
    }

    template() {
    }

    onLoaded() {
        this.props = this.getProps();
        for (const label of Object.keys(this.props.contents)) {
            const component = this.props.contents[label];

            this.regions.self.append(component);
        }
    }

    update() {
        this.props = this.getProps();
        for (const label of Object.keys(this.props.contents)) {
            const component = this.props.contents[label];
            const hidden = this.props.selectedTab !== label;

            if (hidden) {
                component.el.setAttribute('hidden', '');
            } else {
                component.el.removeAttribute('hidden');
            }
        }
    }

}
