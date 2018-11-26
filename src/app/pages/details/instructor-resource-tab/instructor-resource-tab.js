import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import ResourceBox from '../resource-box/resource-box';
import shell from '~/components/shell/shell';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './instructor-resource-tab.html';
import css from './instructor-resource-tab.css';

export default class InstructorResourceTab extends Controller {

    init(model, compCopyDialogProps) {
        this.template = template;
        this.model = model;
        this.css = css;
        this.view = {
            classes: ['instructor-resources']
        };

        this.dialogProps = compCopyDialogProps;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);

        const Region = this.regions.self.constructor;
        const resourceBoxes = this.el.querySelectorAll('resource-box');

        this.model.userStatusPromise.then((userStatus) => {
            for (const index of this.model.resources.keys()) {
                const region = new Region(resourceBoxes[index]);
                const resourceData = this.model.resources[index];
                const resourceBox = new ResourceBox(
                    Object.assign({
                        heading: resourceData.resource_heading,
                        description: resourceData.resource_description,
                        creatorFest: resourceData.creator_fest_resource
                    }, ResourceBox.instructorResourceBoxPermissions(resourceData, userStatus, 'Instructor resources'))
                );

                region.append(resourceBox);

                $.scrollToHash();
            }
        });
    }

    @on('click a[href$="/comp-copy"]')
    handleCompCopy(event) {
        event.preventDefault();
        shell.showDialog(() => this.dialogProps);
    }

}
