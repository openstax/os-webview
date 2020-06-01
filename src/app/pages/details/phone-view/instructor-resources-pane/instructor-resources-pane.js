import componentType from '~/helpers/controller/init-mixin';
import {instructorResourceBoxPermissions} from '../../resource-box/resource-box';
import WrappedJsx from '~/controllers/jsx-wrapper';
import attachFeaturedResources from '../../instructor-resource-tab/featured-resources/featured-resources.js';
import ResourceBoxes from '../../resource-box/resource-boxes.jsx';
import shellBus from '~/components/shell/shell-bus';
import routerBus from '~/helpers/router-bus';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './instructor-resources-pane.html';
import css from './instructor-resources-pane.css';

const spec = {
    template,
    css,
    view: {
        classes: ['instructor-resources-pane']
    },
    regions: {
        freeResources: '.free-resources-region'
    },
    model() {
        return {
            hasFeaturedResources: Boolean(this.props.featuredResources.length)
        };
    }
};

function resourceBoxModel(resourceData, userStatus) {
    return Object.assign({
        heading: resourceData.resource_heading,
        description: '',
        creatorFest: resourceData.creator_fest_resource,
        comingSoon: Boolean(resourceData.coming_soon_text),
        comingSoonText: ''
    }, instructorResourceBoxPermissions(resourceData, userStatus, 'Instructor resources'));
}

export default class extends componentType(spec) {

    init(props) {
        super.init();
        this.props = props;
    }

    onLoaded() {
        this.props.userStatusPromise.then((userStatus) => {
            const featuredModels = this.props.featuredResources
                .map((res) => resourceBoxModel(res, userStatus));
            const otherModels = this.props.otherResources
                .map((res) => resourceBoxModel(res, userStatus));

            if (featuredModels.length > 0) {
                attachFeaturedResources(
                    {
                        headline: this.props.featuredResourcesHeader,
                        resources: featuredModels
                    },
                    this.el.querySelector('.featured-resources')
                );
            }
            if (this.props.communityResource) {
                otherModels.unshift(this.props.communityResource);
            }
            const resourceBoxes = new WrappedJsx(
                ResourceBoxes, {models: otherModels},
                this.regions.freeResources.el
            );
        });
    }

    @on('click a[href$="/comp-copy"]')
    handleCompCopy(event) {
        event.preventDefault();
        shellBus.emit('showDialog', () => this.props.compCopyDialogProps);
    }

    @on('click .filter-for-book')
    saveBookInHistoryState() {
        routerBus.emit('navigate', '/partners', {
            book: this.props.bookAbbreviation
        }, true);
    }


}
