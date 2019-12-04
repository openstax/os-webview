import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './results.html';
import css from './results.css';
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

    get filteredEntries() {
        let result = this.entries;

        if (this.books.value.length > 0) {
            result = result.filter((entry) => {
                return entry.books.find((title) => this.books.includes(title));
            });
        }

        if (this.types.value.length > 0) {
            result = result.filter((entry) => {
                return this.types.includes(entry.type);
            });
        }

        if (this.advanced.value.length > 0) {
            result = result.filter((entry) => {
                return entry.advancedFeatures.find((feature) => this.advanced.includes(feature));
            });
        }

        return result;
    }

    onLoaded() {
        const handleNotifyFor = (store) => {
            store.on('notify', () => this.update());
        };

        handleNotifyFor(this.displayMode);
        handleNotifyFor(this.books);
        handleNotifyFor(this.types);
        handleNotifyFor(this.advanced);
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
