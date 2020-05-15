import bookPromise from '~/models/book-titles';
import $ from '~/helpers/$';
import componentType from '~/helpers/controller/init-mixin';
import css from './errata-summary.css';
import routerBus from '~/helpers/router-bus';
import {getDisplayStatus} from '~/helpers/errata';
import Hero from './hero/hero.jsx';
import StripsAndFilter from './strips-and-filter/strips-and-filter';
import Table from './table/table';
import WrappedJsx from '~/controllers/jsx-wrapper';

const spec = {
    view: {
        classes: ['errata-summary', 'page'],
        tag: 'main'
    },
    slug: 'set in init'
};

export default class extends componentType(spec) {

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
        });
    }

    attachChildren() {
        const filter = new StripsAndFilter();
        const table = new Table(this.tableProps());
        const hero = new WrappedJsx(Hero, {
            slug: `books/${this.bookInfo.meta.slug}`,
            title: this.bookInfo.title
        });

        filter.on('change', (selectedItem) => {
            this.selectedFilter = selectedItem;
            history.replaceState('', '',
                selectedItem ? `#${selectedItem}` :
                    window.location.href.replace(location.hash, '')
            );
            table.emit('update');
        });

        this.regions.self.attach(hero);
        this.regions.self.append(filter);
        this.regions.self.append(table);
    }

    tableProps() {
        const errataEntries = this.pageData || [];
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
                return errataEntries.filter(matchesFilter);
            }
        };
    }

    onDataLoaded() {
        const summary = this.pageData;

        summary.forEach((detail) => {
            const displayStatus = getDisplayStatus(detail);

            detail.self = detail;
            detail.displayStatus = displayStatus.status;
            detail.barStatus = displayStatus.barStatus;
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
