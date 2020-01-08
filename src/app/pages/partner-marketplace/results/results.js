import componentType, {cleanupMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './results.html';
import css from './results.css';
import Result from './result/result';
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
            displayMode: this.displayMode.value
        };
    },
    regions: {
        cards: '.boxed'
    }
};

export default class extends componentType(spec, busMixin, cleanupMixin) {

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
            this.cleanup.push(
                store.on('notify', () => this.update())
            );
        };

        if (super.onLoaded) {
            super.onLoaded();
        }
        handleNotifyFor(this.displayMode);
        handleNotifyFor(this.books);
        handleNotifyFor(this.types);
        handleNotifyFor(this.advanced);
        handleNotifyFor(this.costs);
        handleNotifyFor(this.sort);
        this.attachCards();
    }

    attachCards() {
        this.regions.cards.empty();
        this.filteredEntries.forEach((entry) => {
            const card = new Result({
                model: {
                    title: entry.title,
                    logoUrl: entry.logoUrl,
                    description: entry.blurb,
                    tags: entry.tags
                }
            });

            this.regions.cards.append(card);
            card.on('select', () => this.emit('select', entry));
        });
    }

    onUpdate() {
        if (super.onUpdate) {
            super.onUpdate();
        }
        if (typeof this.regions.cards === 'object') {
            this.attachCards();
        }
    }

}
