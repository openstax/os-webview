import VERSION from '~/version';
import {Controller} from 'superb.js';
import ResourceBox from '../resource-box/resource-box';
import {description as template} from './instructor-resource-tab.html';

export default class InstructorResourceTab extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.css = `/app/pages/details-new/instructor-resource-tab/instructor-resource-tab.css?${VERSION}`;
        this.view = {
            classes: ['instructor-resources']
        };
    }

    onLoaded() {
        const Region = this.regions.self.constructor;
        const resourceBoxes = this.el.querySelectorAll('resource-box');

        this.model.userStatusPromise.then((userStatus) => {
            for (const index of this.model.resources.keys()) {
                const region = new Region(resourceBoxes[index]);
                const resourceData = this.model.resources[index];
                const resourceBox = new ResourceBox(
                    Object.assign({
                        heading: resourceData.resource_heading,
                        description: resourceData.resource_description
                    }, ResourceBox.instructorResourceBoxPermissions(resourceData, userStatus))
                );

                region.attach(resourceBox);
            }
        });
    }

}
