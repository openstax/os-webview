import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import settings from 'settings';
import ResourceBox from '../resource-box/resource-box';
import {description as template} from './student-resource-tab.html';

export default class StudentResourceTab extends Controller {

    init(props) {
        this.template = template;
        this.props = props;
        this.view = {
            classes: ['student-resources']
        };
        this.regions = {
            resourceBoxes: '.resources'
        };
        this.css = `/app/pages/details-new/student-resource-tab/student-resource-tab.css?${VERSION}`;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
        const resourceBoxes = this.el.querySelectorAll('resource-box');

        this.props.userStatusPromise.then((userStatus) => {
            for (const index of this.props.resources.keys()) {
                const resourceData = this.props.resources[index];
                const resourceBox = new ResourceBox(
                    Object.assign({
                        heading: resourceData.resource_heading,
                        description: resourceData.resource_description
                    }, ResourceBox.studentResourceBoxPermissions(resourceData, userStatus))
                );

                this.regions.resourceBoxes.append(resourceBox);
            }
        });
    }

}
