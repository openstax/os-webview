import componentType from '~/helpers/controller/init-mixin';
import $ from '~/helpers/$';
import {instructorResourceBoxPermissions} from '../resource-box/resource-box';
import insertPartners from './partners/partners';
import shellBus from '~/components/shell/shell-bus';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './instructor-resource-tab.html';
import css from './instructor-resource-tab.css';
import partnerFeaturePromise from '~/models/salesforce-partners';
import attachFeaturedResources from './featured-resources/featured-resources.js';
import ResourceBoxes from '../resource-box/resource-boxes.jsx';
import WrappedJsx from '~/controllers/jsx-wrapper';

const spec = {
    template,
    css,
    view: {
        classes: ['instructor-resources']
    },
    regions: {
        partners: '.partners',
        resources: '.resources',
        featured: '.featured-resources'
    }
};

function resourceBoxModel(resourceData, userStatus, search) {
    return Object.assign(
        {
            heading: resourceData.resource_heading,
            description: resourceData.resource_description,
            creatorFest: resourceData.creator_fest_resource,
            comingSoon: Boolean(resourceData.coming_soon_text),
            comingSoonText: resourceData.coming_soon_text,
            featured: resourceData.featured
        },
        instructorResourceBoxPermissions(resourceData, userStatus, search)
    );
}

export default class InstructorResourceTab extends componentType(spec) {

    onLoaded() {
        this.userStatusPromise.then((userStatus) => {
            const loggedIn = Boolean(userStatus.userInfo && userStatus.userInfo.id);

            if (loggedIn) {
                this.model.freeStuff.blurb = this.model.freeStuff.loggedInBlurb;
            }
            this.insertHtml();
            const resourceModels = this.model.resources
                .map((resourceData, i) => resourceBoxModel(
                    resourceData, userStatus, 'Instructor resources', i === 0
                ));
            const featuredResourceModels = resourceModels.filter((r) => r.featured);

            if (featuredResourceModels.length > 0) {
                attachFeaturedResources(
                    {
                        headline: this.featuredResourcesHeader,
                        resources: featuredResourceModels
                    },
                    this.regions.featured.el
                );
                this.model.showDivider = true;
                this.update();
            }

            const models = resourceModels
                .filter((r) => !r.featured)
                .map((obj, i) =>
                    (i === 0) ? Object.assign({double: true}, obj) : obj
                );
            const resourceBoxes = new WrappedJsx(
                ResourceBoxes, {models},
                this.regions.resources.el
            );

            $.scrollToHash();
        });
        const filteredPartnersPromise = partnerFeaturePromise
            .then((pd) => pd.filter(
                (p) => {
                    const books = (p.books || '').split(';');

                    return books.includes(this.bookAbbreviation);
                }
            ));

        filteredPartnersPromise.then((p) => {
            this.model.includePartners = p.length > 0 ? 'include-partners' : '';
            this.update();
        });
        insertPartners({
            dataPromise: filteredPartnersPromise,
            targetEl: this.regions.partners.el,
            bookAbbreviation: this.bookAbbreviation,
            title: this.partnerListLabel,
            seeMoreText: this.seeMoreText
        });
    }

    @on('click a[href$="/comp-copy"]')
    handleCompCopy(event) {
        event.preventDefault();
        shellBus.emit('showDialog', () => this.dialogProps);
    }

}
