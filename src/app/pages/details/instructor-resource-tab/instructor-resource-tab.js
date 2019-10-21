import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import ResourceBox from '../resource-box/resource-box';
import shellBus from '~/components/shell/shell-bus';
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
        const Region = this.regions.self.constructor;
        const resourceBoxes = this.el.querySelectorAll('resource-box');

        this.model.userStatusPromise.then((userStatus) => {
            const loggedIn = Boolean(userStatus.userInfo && userStatus.userInfo.id);

            if (loggedIn) {
                this.model.freeStuff.blurb = this.model.freeStuff.loggedInBlurb;
            }
            $.insertHtml(this.el, this.model);
            for (const index of this.model.resources.keys()) {
                const region = new Region(resourceBoxes[index]);
                const resourceData = this.model.resources[index];
                const resourceBox = new ResourceBox(
                    Object.assign({
                        heading: resourceData.resource_heading,
                        description: resourceData.resource_description,
                        creatorFest: resourceData.creator_fest_resource,
                        comingSoon: Boolean(resourceData.coming_soon_text),
                        comingSoonText: resourceData.coming_soon_text
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
        shellBus.emit('showDialog', () => this.dialogProps);
    }

}
