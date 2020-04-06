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
        featuredResources: '.featured-resources',
        freeResources: '.free-resources-region'
    },
    model() {
        return this.props.resources;
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
            const models = this.props.resources.freeResources.map((res) => resourceBoxModel(res, userStatus));

            attachFeaturedResources(
                {
                    headline: 'Something about why these are special',
                    resources: models.slice(0, 6)
                },
                this.regions.featuredResources.el
            );
            const resourceBoxes = new WrappedJsx(
                ResourceBoxes, {models},
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
