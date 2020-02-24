import componentType, {cleanupMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './results.html';
import css from './results.css';
import Result from './result/result';
import orderBy from 'lodash/orderBy';
import shuffle from 'lodash/shuffle';
import {on} from '~/helpers/controller/decorators';
import {resultCount} from '../store';

export const costOptions = [
    'Free - $10',
    '$11 - $25',
    '$26 - $40',
    '> $40'
].map((label) => ({
    label,
    value: label.replace(/ /g, '')
}));

const costOptionValues = costOptions.map((entry) => entry.value);

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
                return this.types.value === entry.type;
            });
        }

        if (this.advanced.value.length > 0) {
            result = result.filter((entry) => {
                return this.advanced.value
                    .filter((feature) => !costOptionValues.includes(feature))
                    .every((requiredFeature) => {
                        return entry.advancedFeatures.includes(requiredFeature);
                    });
            });
            const costFeatures = this.advanced.value
                .filter((feature) => costOptionValues.includes(feature));

            if (costFeatures.length) {
                result = result.filter((entry) => {
                    return costFeatures.some((costPossibility) => entry.cost === costPossibility);
                });
            }
        }

        resultCount.value = result.length;

        return ['1', '-1'].includes(this.sort.value) ?
            orderBy(
                result,
                [(entry) => entry.title.toLowerCase()],
                [(this.sort.value === '-1' ? 'desc' : 'asc')]
            ) :
            shuffle(result);
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
                    tags: entry.tags,
                    verifiedFeatures: entry.verifiedFeatures,
                    badgeImage: '/images/partners/verified-badge.svg'
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
