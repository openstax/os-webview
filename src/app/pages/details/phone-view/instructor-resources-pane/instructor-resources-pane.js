import {Controller} from 'superb.js';
import settings from 'settings';
import ResourceBox from '../../resource-box/resource-box';
import shell from '~/components/shell/shell';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './instructor-resources-pane.html';
import css from './instructor-resources-pane.css';

export default class InstructorResourcePane extends Controller {

    init(props) {
        this.props = props;
        this.template = template;
        this.view = {
            classes: ['instructor-resources-pane']
        };
        this.regions = {
            freeResources: '.free-resources-region'
        };
        /* eslint max-len: 0 */
        this.css = css;
        // Static model
        this.model = {
            resources: props.resources
        };
    }

    onLoaded() {
        this.props.userStatusPromise.then((userStatus) => {
            for (const res of this.props.resources.freeResources) {
                const resourceBox = new ResourceBox(
                    Object.assign({
                        heading: res.resource_heading,
                        description: '',
                        creatorFest: res.creator_fest_resource
                    }, ResourceBox.instructorResourceBoxPermissions(res, userStatus, 'Instructor resources'))
                );

                this.regions.freeResources.append(resourceBox);
            }
        });
    }

    @on('click a[href$="/comp-copy"]')
    handleCompCopy(event) {
        event.preventDefault();
        shell.showDialog(() => this.props.compCopyDialogProps);
    }

}
