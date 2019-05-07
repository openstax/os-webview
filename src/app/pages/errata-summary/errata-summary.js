import {bookPromise} from '~/models/book-titles';
import $ from '~/helpers/$';
import componentType, {loaderMixin} from '~/helpers/controller/init-mixin';
import css from './errata-summary.css';
import routerBus from '~/helpers/router-bus';
import Hero from './hero/hero';
import StripsAndFilter from './strips-and-filter/strips-and-filter';
import Table from './table/table';

const spec = {
    view: {
        classes: ['errata-summary', 'page'],
        tag: 'main'
    },
    slug: 'set in init'
};

// eslint-disable-next-line complexity
function setDisplayStatus(detail) {
    const result = {
        status: 'Reviewed',
        barStatus: ''
    };

    if (['New', 'Editorial Review'].includes(detail.status)) {
        result.status = 'In Review';
    } else if (detail.resolution === 'Approved') {
        if (detail.status === 'Completed') {
            result.status = `Corrected ${new Date(detail.modified).toLocaleDateString()} in web view`;
            result.barStatus = 'Corrected';
        } else {
            result.status = 'Will Correct';
        }
    } else if (detail.status === 'Completed' && detail.resolution === 'Duplicate') {
        result.status = result.barStatus = 'Duplicate';
    } else {
        result.status = result.barStatus = 'No Correction';
    }

    detail.displayStatus = result.status;
    detail.barStatus = result.barStatus;
}

export default class extends componentType(spec, loaderMixin) {

    init() {
        super.init();
        const book = $.parseSearchString(window.location.search).book[0];

        this.slug = `errata/?book_title=${book}&is_assessment_errata__not=Yes&archived=False`;
        this.dataLoaded = Promise.all([bookPromise, new Promise((resolve) => {
            this.resolvePageData = resolve;
        })]);
        bookPromise.then((bookList) => {
            const entry = bookList.find((info) => info.title === book);

            if (entry) {
                this.bookInfo = entry;
            } else {
                routerBus.emit('navigate', '/_404');
            }
        });
        this.selectedFilter = window.location.hash.replace('#', '');
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.dataLoaded.then(() => {
            this.attachChildren();
            this.hideLoader();
        });
    }

    attachChildren() {
        const filter = new StripsAndFilter();
        const table = new Table(this.tableProps());

        filter.on('change', (selectedItem) => {
            this.selectedFilter = selectedItem;
            history.replaceState('', '',
                selectedItem ? `#${selectedItem}` :
                    window.location.href.replace(location.hash, '')
            );
            table.emit('update');
        });

        this.regions.self.attach(new Hero({
            title: this.bookInfo.title
        }));
        this.regions.self.append(filter);
        this.regions.self.append(table);
    }

    tableProps() {
        const errataEntries = this.pageData || [];
        const bookId = this.bookInfo.id;
        const matchesFilter = (item) => {
            switch (this.selectedFilter) {
            case '':
                return true;
                break;
            case 'in-review':
                return item.displayStatus === 'In Review';
                break;
            case 'reviewed':
                return (/Reviewed|Will Correct|No Correction/).test(item.displayStatus);
                break;
            default:
                return (/^Corrected/).test(item.displayStatus);
            }
        };

        return {
            get filteredErrataEntries() {
                return errataEntries.filter(
                    (item) => item.book === bookId && matchesFilter(item)
                );
            }
        };
    }

    onDataLoaded() {
        const summary = this.pageData;

        summary.forEach((detail) => {
            detail.self = detail;
            setDisplayStatus(detail);
            detail.date = new Date(detail.created).toLocaleDateString();
            detail.source = detail.resource === 'Other' ? detail.resource_other : detail.resource;
            /* eslint camelcase: 0 */
            detail.error_type = detail.error_type === 'Other' ? detail.error_type_other : detail.error_type;
        });
        this.summaryData = summary;
        if (this.savedScrollPosition) {
            window.scroll(0, this.savedScrollPosition);
        }
        this.resolvePageData();
    }

};
