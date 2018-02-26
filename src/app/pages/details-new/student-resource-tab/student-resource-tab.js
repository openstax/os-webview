import VERSION from '~/version';
import {Controller} from 'superb.js';
import settings from 'settings';
import ResourceBox from '../resource-box/resource-box';
import {description as template} from './student-resource-tab.html';

export default class StudentResourceTab extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['student-resources']
        };
        this.css = `/app/pages/details-new/student-resource-tab/student-resource-tab.css?${VERSION}`;
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
                    }, ResourceBox.studentResourceBoxPermissions(resourceData, userStatus))
                );

                region.attach(resourceBox);
            }
        });
    }

}
