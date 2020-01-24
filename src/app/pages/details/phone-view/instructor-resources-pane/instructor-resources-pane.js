import componentType from '~/helpers/controller/init-mixin';
import ResourceBox from '../../resource-box/resource-box';
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
        return this.props.resources;
    }
};

export default class extends componentType(spec) {

    init(props) {
        super.init();
        this.props = props;
    }

    onLoaded() {
        this.props.userStatusPromise.then((userStatus) => {
            this.props.resources.freeResources.forEach((res) => {
                const model = Object.assign({
                    heading: res.resource_heading,
                    description: '',
                    creatorFest: res.creator_fest_resource,
                    comingSoon: Boolean(res.coming_soon_text),
                    comingSoonText: ''
                }, ResourceBox.instructorResourceBoxPermissions(res, userStatus, 'Instructor resources'));
                const resourceBox = new ResourceBox(model);

                this.regions.freeResources.append(resourceBox);
            });
        });
    }

    @on('click a[href$="/comp-copy"]')
    handleCompCopy(event) {
        event.preventDefault();
        shellBus.emit('showDialog', () => this.props.compCopyDialogProps);
    }

    @on('click .filter-for-book')
    saveBookInHistoryState() {
        routerBus.emit('navigate', '/partner-marketplace', {
            book: this.props.bookAbbreviation
        }, true);
    }


}
