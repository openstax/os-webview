import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
import settings from 'settings';
import {bookPromise} from '~/models/book-titles';
import router from '~/router';
import userModel from '~/models/usermodel';
import Form from './form/form';
import Detail from './detail/detail';
import RadioPanel from '~/components/radio-panel/radio-panel';
import {render as template} from './errata.html';

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
    } else {
        result.status = result.barStatus = 'No Correction';
    }

    detail.displayStatus = result.status;
    detail.barStatus = result.barStatus;
}

const statusSortOrder = {
    'Co': 0,
    'Wi': 1,
    'No': 2,
    'In': 3
};

export default class Errata extends Controller {

    static setDisplayStatus = setDisplayStatus;

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
            history.replaceState('', '',
                selectedItem ? `#${selectedItem}` :
                    window.location.href.replace(location.hash, '')
            );
            this.update();
        });
        this.matchesFilter = (item) => {
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
        this.selectedFilter = window.location.hash.replace('#', '');
        this.radioPanel.updateSelected(this.selectedFilter);
        this.sortFunctions = {
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
        this.model = {
            mode: 'detail',
            instructions: 'Errata submissions are displayed below until a new PDF is published online.',
            moreAbout: 'More about our correction schedule',
            errorTypes: [
                'Typo', 'Broken link', 'Incorrect calculation or solution',
                'Other factual inaccuracy in content',
                'General/pedagogical suggestion or question',
                'Other'
            ],
            sourceTypes: [
                'Textbook', 'iBooks version', 'Instructor solution manual',
                'Student solution manual', 'Other'
            ],
            subnotes: {'Textbook': 'includes print, PDF, and web view'},
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
                    key: 'displayStatus',
                    sortFn: 'sortDecision',
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
        shell.showLoader();
    }

    onLoaded() {
        document.title = 'Errata - OpenStax';
        this.savedScrollPosition = history.state && history.state.y;
        const queryDict = $.parseSearchString(window.location.search);
        const afterTheSlash = location.pathname.replace('/errata/', '');

        if (afterTheSlash === 'form') {
            this.showForm(queryDict);
        } else if (afterTheSlash > 0) {
            this.fetchAndDisplay(afterTheSlash);
        } else if ('book' in queryDict) {
            this.summary(queryDict.book[0]);
        } else {
            window.location = '/404';
        }
        this.regions.filter.attach(this.radioPanel);
    }

    onUpdate() {
        $.insertHtml(this.el.querySelector('.hero'), this.model);
    }

    showForm(queryDict) {
        const title = (queryDict.book || [''])[0];

        userModel.load().then((response) => {
            this.model.defaultEmail = response.email;
            this.model.submittedBy = response.id;
            if (response.accounts_id) {
                this.model.title = () => `Suggest a Correction for ${this.model.selectedTitle}`;
                bookPromise.then((books) => {
                    const entry = books.find((info) => info.title === title);

                    if (!entry) {
                        router.navigate('/404');
                    }

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
                    shell.hideLoader();

                    const slug = entry.meta.slug;

                    this.fetchReleaseNotes(slug).then(() => {
                        form.update();
                    });
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
            setDisplayStatus(detail);
            const bars = detail.barStatus ? 2 : {
                'In Review': 0,
                'Reviewed': 1,
                'Will Correct': 1
            }[detail.displayStatus];
            const thirdNodeFill = detail.barStatus === 'Corrected' ? ' filled' : ' filled-no';

            detail.firstNodeClass = bars === 0 ? ' filled ' : '';
            detail.secondNodeClass = bars === 1 ? ' filled' : '';
            detail.thirdNodeClass = bars > 1 ? thirdNodeFill : '';
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
            if (detail.created) {
                this.model.bookTitle = detail.bookTitle;
                setModelDetail(detail);
                shell.hideLoader();
                detail.showDatesInBar = detail.barStatus === '' || detail.reviewed_date;
                detail.createdDate = new Date(detail.created).toLocaleDateString();
                detail.reviewedDate = detail.reviewed_date ? new Date(detail.reviewed_date).toLocaleDateString() : '';
                detail.correctedDate = detail.reviewedDate;
                if (detail.corrected_date) {
                    detail.correctedDate = new Date(detail.corrected_date).toLocaleDateString();
                }
                if (detail.thirdNodeClass === '') {
                    detail.correctedDate = '';
                }
                this.update();
            } else {
                window.location = '/404';
            }
        }).catch((e) => {
            window.location = '/404';
        });
    }

    fetchReleaseNotes(slug) {
        const url = `${settings.apiOrigin}/api/books/${slug}`;

        return fetch(url).then((r) => r.json()).then((bookInfo) => {
            const notes = bookInfo.book_faculty_resources
                .find((entry) => entry.resource_heading === 'Errata Release Notes');

            if (bookInfo.tutor_marketing_book) {
                if (!this.model.sourceTypes.includes('OpenStax Tutor')) {
                    this.model.sourceTypes.splice(-1, 0, 'OpenStax Tutor');
                }
            };
            if (notes) {
                this.model.releaseNotes = notes.link_document_url;
                this.update();
            }
        });
    }

    summary(book) {
        // Fetch the summary data once
        const summaryPromise = fetch(`${settings.apiOrigin}/api/errata/?book_title=${book}`)
            .then((r) => r.json());

        bookPromise.then((bookList) => {
            const entry = bookList.find((info) => info.title === book);

            if (entry) {
                this.fetchReleaseNotes(entry.meta.slug);
                this.model.summaryBook = entry.id;
                this.model.title = () => `${entry.title} Errata`;
            } else {
                router.navigate('/404');
            }
            this.model.mode = 'summary';
            summaryPromise.then((summary) => {
                for (const detail of summary) {
                    detail.self = detail;
                    setDisplayStatus(detail);
                    detail.date = new Date(detail.created).toLocaleDateString();
                    detail.source = detail.resource === 'Other' ? detail.resource_other : detail.resource;
                    /* eslint camelcase: 0 */
                    detail.error_type = detail.error_type === 'Other' ? detail.error_type_other : detail.error_type;
                }
                this.model.summaryData = summary;
                this.sortData('sortDate', 'date');
                this.update();
                shell.hideLoader();
                if (this.savedScrollPosition) {
                    window.scroll(0, this.savedScrollPosition);
                }
            });
        });
    }

    sortData(sortFn, key) {
        this.model.summarySortedBy = key;
        this.model.summarySortDirection = sortFn === 'sort' ? 1 : -1;
        this.model.summaryData.sort((a, b) => this.sortFunctions[sortFn](a[key], b[key]));
        if (this.model.summarySortDirection < 0) {
            this.model.summaryData.reverse();
        }
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
            this.sortData(sortFn, key);
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
