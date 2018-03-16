import VERSION from '~/version';
import {Controller} from 'superb.js';
import settings from 'settings';
import ResourceBox from '../../resource-box/resource-box';
import compCopyDialogProps from '../../comp-copy-dialog-props';
import shell from '~/components/shell/shell';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './instructor-resources-pane.html';

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
        this.css = `/app/pages/details-new/phone-view/instructor-resources-pane/instructor-resources-pane.css?${VERSION}`;
        // Static model
        this.model = {
            resources: props.resources
        };
    }

    onLoaded() {
        this.dialogProps = compCopyDialogProps(() => ({
            title: this.props.bookInfo.title,
            coverUrl: this.props.bookInfo.cover_url
        }));
        this.props.userStatusPromise.then((userStatus) => {
            for (const res of this.props.resources.freeResources) {
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

    @on('click a[href$="/comp-copy"]')
    handleCompCopy(event) {
        event.preventDefault();
        shell.showDialog(() => this.dialogProps);
    }

}
