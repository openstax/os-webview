import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './table.html';
import {on} from '~/helpers/controller/decorators';
import busMixin from '~/helpers/controller/bus-mixin';
import $ from '~/helpers/$';

const columnSpecs = [
    {
        label: 'Date Submitted',
        key: 'date',
        sortFn: 'sortDate',
        cssClass: 'mid'
    },
    {
        label: 'ID',
        key: 'id',
        sortFn: 'sortNumber',
        cssClass: 'narrow'
    },
    {
        label: 'Source',
        key: 'source',
        sortFn: 'sort',
        cssClass: 'mid'
    },
    {
        label: 'Error Type',
        key: 'error_type',
        sortFn: 'sort',
        cssClass: 'narrow'
    },
    {
        label: 'Location',
        key: 'location',
        cssClass: 'mid-wide'
    },
    {
        label: 'Description',
        key: 'detail',
        cssClass: 'most-wide'
    },
    {
        label: 'Decision',
        key: 'displayStatus',
        sortFn: 'sortDecision',
        cssClass: 'mid'
    }
];
const statusSortOrder = {
    'Co': 0,
    'Wi': 1,
    'No': 2,
    'In': 3
};
const sortFunctions = {
    sortDate: (a, b) => new Date(a) - new Date(b),
    sort: (a, b) => {
        const as = a === null ? '' : a;
        const bs = b === null ? '' : b;

        return as.localeCompare(bs, 'en', {sensitivity: 'base'});
    },
    sortNumber: (a, b) => a - b,
    sortDecision: (a, b) => {
        /* eslint complexity: 0 */
        const ar = statusSortOrder[a.substr(0, 2)];
        const br = statusSortOrder[b.substr(0, 2)];

        if (ar !== br) {
            return br - ar;
        }
        const ad = new Date(a.modified);
        const bd = new Date(b.modified);

        if (ad < bd) {
            return -1;
        }
        return 1;
    }
};

const spec = {
    template,
    view: {
        classes: ['boxed']
    },
    model() {
        return {
            columnSpecs,
            errataEntries: this.errataEntries(),
            sortDir: this.sortDir,
            sortKey: this.sortKey
        };
    }
};

export default class extends componentType(spec, busMixin) {

    init(props) {
        super.init();
        this.props = props;
        this.on('update', this.update.bind(this));
        this.sortFn = 'sortDate';
        this.sortKey = 'date';
        this.sortDir = 1;
    }

    errataEntries() {
        const result = this.props.filteredErrataEntries
            .sort((a, b) => sortFunctions[this.sortFn](a[this.sortKey], b[this.sortKey]));

        if (this.sortDir < 0) {
            result.reverse();
        }
        return result;
    }

    @on('click [data-sort-fn]')
    clickSorter(e) {
        const target = 'sortFn' in e.target.dataset ? e.target : e.target.parentNode;
        const fn = target.dataset.sortFn;
        const key = target.dataset.sortKey;

        if (key === this.sortKey) {
            this.sortDir = -this.sortDir;
        } else {
            this.sortFn = fn;
            this.sortKey = key;
            this.sortDir = 1;
        }
        this.update();
    }

    @on('keydown [data-sort-fn]')
    operateSorterByKey(e) {
        if ([$.key.enter, $.key.space].includes(e.keyCode)) {
            this.clickSorter(e);
            e.preventDefault();
        }
    }

}
