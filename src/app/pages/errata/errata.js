import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import settings from 'settings';
import {bookPromise} from '~/models/book-titles';
import userModel from '~/models/usermodel';
import Form from './form/form';
import Detail from './detail/detail';
import RadioPanel from '~/components/radio-panel/radio-panel';
import {description as template} from './errata.html';

export default class Errata extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/errata/errata.css';
        this.view = {
            classes: ['errata-page', 'page']
        };
        this.regions = {
            filter: '.filter',
            form: '.form-container',
            detail: '.detail-block'
        };
        this.radioPanel = new RadioPanel([
            {value: '', html: 'View All'},
            {value: 'in-review', html: 'In Review'},
            {value: 'reviewed', html: 'Reviewed'},
            {value: 'corrected', html: 'Corrected'}
        ], (selectedItem) => {
            this.selectedFilter = selectedItem;
            this.update();
        });
        this.matchesFilter = (item) => {
            switch (this.selectedFilter) {
            case '':
                return true;
                break;
            case 'in-review':
                return item.status === 'New' || item.status === 'In Review';
                break;
            case 'reviewed':
                return item.status === 'Reviewed';
                break;
            default:
                return item.resolution;
            }
        };
        this.radioPanel.updateSelected('');
        this.sortFunctions = {
            sortDate: (a, b) => new Date(a) - new Date(b),
            sort: (a, b) => {
                const as = a === null ? '' : a;
                const bs = b === null ? '' : b;

                return as.localeCompare(bs, 'en', {sensitivity: 'base'});
            },
            sortNumber: (a, b) => a - b
        };
        this.model = {
            mode: 'detail',
            instructions: 'Errata submissions are displayed below until a new PDF is published online.',
            moreAbout: 'More about our correction schedule',
            tooltipText: 'This should appear on hover',
            errorTypes: [
                'Typo', 'Broken link', 'Incorrect calculation or solution',
                'Other factual inaccuracy in content',
                'General/pedagogical suggestion or question',
                'Other'
            ],
            sourceTypes: [
                'Textbook', 'iBooks version', 'Instructor solution manual',
                'Student solution manual', 'OpenStax Tutor', 'OpenStax Concept Coach',
                'Other'
            ],
            subnotes: {'Textbook': 'includes print, PDF and web view'},
            summaryMetaData: [
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
                    cssClass: 'mid'
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
                    key: 'resolution',
                    sortFn: 'sort',
                    cssClass: 'mid'
                }
            ],
            summarySortedBy: null,
            summaryData: [],
            summaryBook: '',
            summaryFilteredData: () => this.model.summaryData.filter(
                (item) => item.book === this.model.summaryBook && this.matchesFilter(item)
            )
        };
    }

    onLoaded() {
        document.title = 'Errata - OpenStax';
        const queryDict = $.parseSearchString(window.location.search);

        if (location.pathname === '/errata/form') {
            this.showForm(queryDict);
        } else if ('id' in queryDict) {
            this.fetchAndDisplay(queryDict.id[0]);
        } else if ('book' in queryDict) {
            this.summary(queryDict.book[0]);
        }
        this.regions.filter.attach(this.radioPanel);
    }

    onUpdate() {
        $.insertHtml(this.el.querySelector('.hero'), this.model);
    }

    showForm(queryDict) {
        const title = (queryDict.book || [''])[0];

        userModel.load().then((response) => {
            if (response.accounts_id) {
                this.model.title = () => `Suggest a Correction for ${this.model.selectedTitle}`;
                bookPromise.then((books) => {
                    Object.assign(this.model, {
                        mode: 'form',
                        selectedTitle: title,
                        books,
                        location: queryDict.location && queryDict.location[0],
                        source: queryDict.source && queryDict.source[0]
                    });
                    const form = new Form(this.model);

                    this.regions.form.attach(form);
                    this.update();
                });
            } else {
                window.location = userModel.loginLink();
            }
        });
    }

    fetchAndDisplay(id) {
        this.model.mode = 'detail';
        const Region = this.regions.self.constructor;
        const setModelDetail = (detail) => {
            const bars = detail.resolution ? 2 : {
                'New': 0,
                'Editorial Review': 0,
                'Reviewed': 1
            }[detail.status];
            const secondBarFill = detail.resolution === 'Published' ? ' filled' : ' filled-no';

            detail.firstBarClass = bars > 0 ? ' filled' : '';
            detail.secondBarClass = bars > 1 ? secondBarFill : '';
            this.model.title = () => 'Errata Submission Details';
            this.model.book = detail.book;
            this.model.detail = detail;
            const detailComponent = new Detail(detail);
            const detailEl = this.el.querySelector('detail-block');
            const detailRegion = new Region(detailEl, this);

            detailRegion.attach(detailComponent);
            this.update();
        };

        Detail.detailPromise(id).then((detail) => {
            this.model.bookTitle = detail.bookTitle;
            setModelDetail(detail);
        });
    }

    summary(book) {
        // Fetch the summary data once
        const summaryPromise = fetch(`${settings.apiOrigin}/api/errata/?book_title=${book}`)
            .then((r) => r.json()).then((r) => r.results);

        bookPromise.then((bookList) => {
            const entry = bookList.find((info) => info.title === book);

            if (entry) {
                this.model.summaryBook = entry.id;
                this.model.title = () => `${entry.title} Errata`;
            }
            this.model.mode = 'summary';
            summaryPromise.then((summary) => {
                for (const detail of summary) {
                    detail.date = new Date(detail.created).toLocaleDateString();
                    detail.source = detail.resource === 'Other' ? detail.resource_other : detail.resource;
                    /* eslint camelcase: 0 */
                    detail.error_type = detail.error_type === 'Other' ? detail.error_type_other : detail.error_type;
                }
                this.model.summaryData = summary;
                this.update();
            });
        });
    }

    @on('click [data-sort-fn]')
    clickSorter(e) {
        const target = 'sortFn' in e.target.dataset ? e.target : e.target.parentNode;
        const sortFn = target.dataset.sortFn;
        const key = target.dataset.sortKey;

        if (key === this.model.summarySortedBy) {
            this.model.summaryData.reverse();
            this.model.summarySortDirection *= -1;
        } else {
            this.model.summarySortedBy = key;
            this.model.summarySortDirection = 1;
            this.model.summaryData.sort((a, b) => this.sortFunctions[sortFn](a[key], b[key]));
        }
        this.update();
    }

}
