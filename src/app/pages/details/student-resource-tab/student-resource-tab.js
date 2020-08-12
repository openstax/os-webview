import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import settings from 'settings';
import {studentResourceBoxPermissions} from '../resource-box/resource-box';
import WrappedJsx from '~/controllers/jsx-wrapper';
import ResourceBoxes from '../resource-box/resource-boxes';
import {description as template} from './student-resource-tab.html';
import css from './student-resource-tab.css';

function resourceBoxModel(resourceData, userStatus, search) {
    return Object.assign({
        heading: resourceData.resource_heading,
        description: resourceData.resource_description,
        comingSoon: Boolean(resourceData.coming_soon_text),
        comingSoonText: resourceData.coming_soon_text
    }, studentResourceBoxPermissions(resourceData, userStatus, 'Student resources'));
}

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

        this.props.userStatusPromise.then((userStatus) => {
            const models = this.props.resources.map((resourceData) =>
                resourceBoxModel(resourceData, userStatus, 'Student resources')
            );
            const resourceBoxes = new WrappedJsx(
                ResourceBoxes, {models},
                this.regions.resourceBoxes.el
            );
        });
    }

}
