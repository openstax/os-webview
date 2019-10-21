import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import settings from 'settings';
import ResourceBox from '../resource-box/resource-box';
import {description as template} from './student-resource-tab.html';
import css from './student-resource-tab.css';

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
        this.css = css;
    }

    onLoaded() {
        $.insertHtml(this.el, {
            freeStuff: this.props.freeStuff
        });
        const resourceBoxes = this.el.querySelectorAll('resource-box');

        this.props.userStatusPromise.then((userStatus) => {
            for (const index of this.props.resources.keys()) {
                const resourceData = this.props.resources[index];
                const resourceBox = new ResourceBox(
                    Object.assign({
                        heading: resourceData.resource_heading,
                        description: resourceData.resource_description,
                        comingSoon: Boolean(resourceData.coming_soon_text),
                        comingSoonText: resourceData.coming_soon_text
                    }, ResourceBox.studentResourceBoxPermissions(resourceData, userStatus, 'Student resources'))
                );

                this.regions.resourceBoxes.append(resourceBox);
            }
        });
    }

}
