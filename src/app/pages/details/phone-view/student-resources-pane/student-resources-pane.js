import {Controller} from 'superb.js';
import settings from 'settings';
import ResourceBox from '../../resource-box/resource-box';
import css from './student-resources-pane.css';

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
            for (const res of this.props.resources) {
                const component = new ResourceBox(
                    Object.assign({
                        heading: res.resource_heading,
                        description: '',
                        comingSoon: Boolean(res.coming_soon_text),
                        comingSoonText: ''
                    }, ResourceBox.studentResourceBoxPermissions(res, userStatus, 'Student resources'))
                );

                this.regions.self.append(component);
            }
        });
    }

}
