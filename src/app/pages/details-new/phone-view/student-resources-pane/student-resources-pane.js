import VERSION from '~/version';
import {Controller} from 'superb.js';
import settings from 'settings';
import ResourceBox from '../../resource-box/resource-box';

export default class StudentResourcePane extends Controller {

    init(props) {
        this.props = props;
        this.template = () => '';
        this.view = {
            classes: ['student-resources-pane']
        };
        this.css = `/app/pages/details-new/phone-view/student-resources-pane/student-resources-pane.css?${VERSION}`;
    }

    onLoaded() {
        this.props.userStatusPromise.then((userStatus) => {
            for (const res of this.props.resources) {
                const component = new ResourceBox(
                    Object.assign({
                        heading: res.resource_heading,
                        description: ''
                    }, ResourceBox.studentResourceBoxPermissions(res, userStatus))
                );

                this.regions.self.append(component);
            }
        });
    }

}
