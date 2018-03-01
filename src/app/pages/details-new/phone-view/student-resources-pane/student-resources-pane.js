import VERSION from '~/version';
import {Controller} from 'superb.js';
import settings from 'settings';
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
        this.model.userStatusPromise.then((userStatus) => {
            for (const res of this.model.resources) {
                const component = new ResourceBox(
                    Object.assign({
                        heading: res.resource_heading,
                        description: res.resource_description
                    }, ResourceBox.studentResourceBoxPermissions(res, userStatus))
                );

                this.regions.self.append(component);
            }
        });
    }

}
