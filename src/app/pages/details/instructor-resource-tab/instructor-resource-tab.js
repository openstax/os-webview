import componentType from '~/helpers/controller/init-mixin';
import $ from '~/helpers/$';
import ResourceBox from '../resource-box/resource-box';
import insertPartners from './partners/partners';
import shellBus from '~/components/shell/shell-bus';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './instructor-resource-tab.html';
import css from './instructor-resource-tab.css';
import partnerFeaturePromise from '~/models/salesforce-partners';

const spec = {
    template,
    css,
    view: {
        classes: ['instructor-resources']
    },
    regions: {
        partners: '.partners'
    }
};

export default class InstructorResourceTab extends componentType(spec) {

    init(...args) {
        super.init(...args);
        this.model.includePartners = 'include-partners';
    }

    onLoaded() {
        const resourceBoxes = this.el.querySelectorAll('resource-box');

        this.userStatusPromise.then((userStatus) => {
            const loggedIn = Boolean(userStatus.userInfo && userStatus.userInfo.id);

            if (loggedIn) {
                this.model.freeStuff.blurb = this.model.freeStuff.loggedInBlurb;
            }
            this.insertHtml();
            this.model.resources.forEach((resourceData, index) => {
                const region = this.regionFrom(resourceBoxes[index]);
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
            });
        });
        insertPartners({
            dataPromise: partnerFeaturePromise,
            targetEl: this.regions.partners.el,
            bookAbbreviation: this.bookAbbreviation
        });
    }

    @on('click a[href$="/comp-copy"]')
    handleCompCopy(event) {
        event.preventDefault();
        shellBus.emit('showDialog', () => this.dialogProps);
    }

}
