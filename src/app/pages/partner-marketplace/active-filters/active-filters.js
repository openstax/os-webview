import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './active-filters.html';
import css from './active-filters.css';
import {books, costs, types, advanced} from '../filter-store';
import FilterRemover from './filter-remover/filter-remover';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['active-filters']
    },
    model() {
        return {
            books: books.value,
            costs: costs.value,
            types: types.value,
            advanced: advanced.value
        };
    },
    filterComponents: [],
    regions: {
        filters: '.filters'
    }
};

function childPropertiesForStore(store) {
    return store.value.map((value) => ({
        value,
        store
    }));
}

function childProperties() {
    return childPropertiesForStore(books).concat(
        childPropertiesForStore(costs),
        childPropertiesForStore(types),
        childPropertiesForStore(advanced)
    );
}

export default class extends componentType(spec) {

    init(...args) {
        super.init(...args);
        this.created = Date.now().toString().substr(-3);
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.filterComponents = [];
        this.notificationRemovers = [books, costs, types, advanced].map((store) =>
            store.on('notify', () => this.update())
        );
        this.updateActiveFilters();
    }

    onClose() {
        if (super.onClose) {
            super.onClose();
        }
        this.notificationRemovers.forEach((r) => r());
        this.filterComponents.forEach((c) => c.detach());
        this.filterComponents = [];
    }

    updateActiveFilters() {
        const cp = childProperties();
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
        costs.clear();
        types.clear();
        advanced.clear();
    }

}
