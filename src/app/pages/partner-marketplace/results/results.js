import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './results.html';
import css from './results.css';
import orderBy from 'lodash/orderBy';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['results']
    },
    model() {
        return {
            entries: this.filteredEntries,
            displayMode: this.displayMode.value
        };
    },
    cleanup: []
};

export default class extends componentType(spec, busMixin, insertHtmlMixin) {

    // eslint-disable-next-line complexity
    get filteredEntries() {
        let result = this.entries;

        if (this.books.value.length > 0) {
            result = result.filter((entry) => {
                return entry.books.find((title) => this.books.includes(title));
            });
        }

        if (this.types.value) {
            result = result.filter((entry) => {
                return this.types === entry.type;
            });
        }

        if (this.advanced.value.length > 0) {
            result = result.filter((entry) => {
                return this.advanced.value.every((requiredFeature) => entry.advancedFeatures.includes(requiredFeature));
            });
        }

        if (this.costs.value) {
            result = result.filter((entry) => entry.cost === this.costs.value);
        }

        return orderBy(
            result,
            [(entry) => entry.title.toLowerCase()],
            [(this.sort.value === '-1' ? 'desc' : 'asc')]
        );
    }

    onLoaded() {
        const handleNotifyFor = (store) => {
            store.on('notify', () => this.update());
        };

        handleNotifyFor(this.displayMode);
        handleNotifyFor(this.books);
        handleNotifyFor(this.types);
        handleNotifyFor(this.advanced);
        handleNotifyFor(this.costs);
        handleNotifyFor(this.sort);
    }

    onClose() {
        this.cleanup.forEach((f) => f());
    }

    @on('click a.card')
    replaceState(event) {
        const href = event.delegateTarget.href;

        this.emit('select', href);
    }

}
