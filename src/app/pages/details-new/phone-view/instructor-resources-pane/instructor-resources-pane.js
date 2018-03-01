import VERSION from '~/version';
import {Controller} from 'superb.js';
import settings from 'settings';
import ResourceBox from '../../resource-box/resource-box';
import {description as template} from './instructor-resources-pane.html';

export default class InstructorResourcePane extends Controller {

    init(model) {
        this.model = model;
        this.template = template;
        this.view = {
            classes: ['instructor-resources-pane']
        };
        this.regions = {
            freeResources: '.free-resources-region'
        };
        /* eslint max-len: 0 */
        this.css = `/app/pages/details-new/phone-view/instructor-resources-pane/instructor-resources-pane.css?${VERSION}`;
    }

    onLoaded() {
        this.model.userStatusPromise.then((userStatus) => {
            for (const res of this.model.resources.freeResources) {
                const resourceBox = new ResourceBox(
                    Object.assign({
                        heading: res.resource_heading,
                        description: res.resource_description
                    }, ResourceBox.instructorResourceBoxPermissions(res, userStatus))
                );

                this.regions.freeResources.append(resourceBox);
            }
            // Paid resources are handled by the template
        });
    }

}
