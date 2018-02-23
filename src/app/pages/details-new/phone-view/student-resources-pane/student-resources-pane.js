import VERSION from '~/version';
import {Controller} from 'superb.js';
import ResourceBox from '../../resource-box/resource-box';

export default class StudentResourcePane extends Controller {

    init(model) {
        this.model = model;
        this.template = () => '';
        this.view = {
            classes: ['student-resources-pane']
        };
        this.css = `/app/pages/details-new/phone-view/student-resources-pane/student-resources-pane.css?${VERSION}`;
    }

    onLoaded() {
        for (const res of this.model) {
            const component = new ResourceBox(res);

            this.regions.self.append(component);
        }
    }

}
