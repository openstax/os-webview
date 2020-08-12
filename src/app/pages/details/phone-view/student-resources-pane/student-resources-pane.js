import {Controller} from 'superb.js';
import settings from 'settings';
import {studentResourceBoxPermissions} from '../../resource-box/resource-box';
import WrappedJsx from '~/controllers/jsx-wrapper';
import ResourceBoxes from '../../resource-box/resource-boxes';
import css from './student-resources-pane.css';

function resourceBoxModel(resourceData, userStatus) {
    return Object.assign({
        heading: resourceData.resource_heading,
        description: '',
        comingSoon: Boolean(resourceData.coming_soon_text),
        comingSoonText: ''
    }, studentResourceBoxPermissions(resourceData, userStatus, 'Student resources'));
}

export default class StudentResourcePane extends Controller {

    init(props) {
        this.props = props;
        this.template = () => '';
        this.view = {
            classes: ['student-resources-pane']
        };
        this.css = css;
    }

    onLoaded() {
        this.props.userStatusPromise.then((userStatus) => {
            const models = this.props.resources.map((res) => resourceBoxModel(res, userStatus));
            const resourceBoxes = new WrappedJsx(
                ResourceBoxes, {models},
                this.regions.self.el
            );
        });
    }

    update() {}
    template() {}

}
