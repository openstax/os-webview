import componentType, {cleanupMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './active-filters.html';
import css from './active-filters.css';
import {books, types, advanced, resultCount} from '../store';
import FilterRemover from './filter-remover/filter-remover';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['active-filters']
    },
    filterComponents: [],
    regions: {
        filters: '.filters'
    },
    model() {
        return {
            resultCount: resultCount.value
        };
    }
};

function childPropertiesForStore(store, decoder) {
    if (store.value instanceof Array) {
        return store.value.map((value) => ({
            value,
            store,
            label: decoder ? decoder[value] : value
        }));
    }
    return store.value ? {
        value: store.value,
        store,
        label: decoder ? decoder[value] : store.value
    } : [];
}

function childProperties(advancedFilterDecoder) {
    return childPropertiesForStore(books).concat(
        childPropertiesForStore(types),
        childPropertiesForStore(advanced, advancedFilterDecoder)
    );
}

export default class extends componentType(spec, cleanupMixin) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.filterComponents = [];
        [books, types, advanced, resultCount].forEach((store) =>
            this.cleanup.push(store.on('notify', () => this.update()))
        );
        this.advancedFilterDecoder = this.advancedFilterOptions.reduce((a, b) => {
            b.options.forEach((opt) => {
                a[opt.value] = opt.label;
            });
            return a;
        }, {});
        this.updateActiveFilters();
    }

    onClose() {
        if (super.onClose) {
            super.onClose();
        }
        this.filterComponents.forEach((c) => c.detach());
    }

    updateActiveFilters() {
        const cp = childProperties(this.advancedFilterDecoder);
        const region = this.regions.filters;

        if (cp.length > 0) {
            this.el.removeAttribute('hidden');
        } else {
            this.el.setAttribute('hidden', '');
        }
        if (typeof region === 'string') {
            return;
        }
        cp.forEach((v, i) => {
            if (i >= this.filterComponents.length) {
                const c = new FilterRemover(v);

                region.append(c);
                this.filterComponents.push(c);
            } else {
                Object.assign(this.filterComponents[i], v);
                this.filterComponents[i].update();
            }
        });
        this.filterComponents.splice(cp.length).forEach((c) => {
            c.detach();
        });
    }

    onUpdate() {
        if (super.onUpdate) {
            super.onUpdate();
        }
        this.updateActiveFilters();
    }

    @on('click [href="clear"]')
    clearFilters(event) {
        event.preventDefault();
        books.clear();
        types.clear();
        advanced.clear();
    }

}
