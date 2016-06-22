import router from '~/router';
import LoadingView from '~/controllers/loading-view';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
// import FilterButton from '~/components/filter-button/filter-button';
import {description as template} from './subjects.html';
import CategorySection from './category-section/category-section';

const apId = 'AP<sup>&reg;</sup>';
const categories = ['Math', 'Science', 'Social Sciences', 'Humanities', apId];
const filterButtons = ['View All', ...categories];

function organizeBooksByCategory(books) {
    const result = {};

    result[apId] = [];

    for (const book of books) {
        if (!(book.subject_name in result)) {
            result[book.subject_name] = [];
        }
        result[book.subject_name].push(book);
        if (book.is_ap) {
            result[apId].push(book);
        }
    }

    return result;
}

export default class Subjects extends LoadingView {

    init() {
        this.template = template;
        this.css = '/app/pages/subjects/subjects.css';
        this.view = {
            classes: ['subjects-page', 'hidden']
        };
        this.regions = {
            filterButtons: '.filter-buttons',
            bookViewer: '.books .container'
        };
        this.model = new Model({
            selectedFilter: 'View All',
            selectedBook: null
        });

        this.description = `Our textbooks are openly licensed, peer-reviewed,
            free, and backed by learning resources. Check out our books and
            decide if they're right for your course.`;

        // this.listenTo(router, 'route', this.updateSelectedFilterFromPath);
        // this.updateSelectedFilterFromPath();
    }

    /*

    @on('click')
    deselect() {
        this.model.set('selectedBook', false);
    }

    @on('click .filter')
    filterClick() {
        const filterSection = this.el.querySelector('.filter');

        $.scrollTo(filterSection, 30);
    }

    updateSelectedFilterFromPath() {
        const pathMatch = window.location.pathname.match(/\/subjects\/(.+)/);
        let selectedFilter = 'View All';

        if (pathMatch) {
            const subject = FilterButton.canonicalSubject(pathMatch[1]);

            for (const c of categories) {
                if (FilterButton.canonicalSubject(c) === subject) {
                    selectedFilter = c;
                }
            }
            if (selectedFilter === 'View All') {
                router.navigate('404', true);
            }
        }
        this.model.set('selectedFilter', selectedFilter);
    }

    renderCategorySections(booksByCategory) {
        for (const category of categories) {
            this.regions.bookViewer.append(new CategorySection(category, booksByCategory[category], this.model));
        }
    }

    onLoaded() {
        const populateBookInfoFields = (data) => {
            const findNode = (name) => this.el.querySelector(`[data-manager="${name}"]`);

            // FIX: Move all DOM manipulation to template
            findNode('page-description').innerHTML = data.page_description;
            findNode('ds1-head').textContent = data.dev_standard_1_heading;
            findNode('ds2-head').textContent = data.dev_standard_2_heading;
            findNode('ds3-head').textContent = data.dev_standard_3_heading;
            findNode('ds1-body').innerHTML= data.dev_standard_1_description;
            findNode('ds2-body').innerHTML= data.dev_standard_2_description;
            findNode('ds3-body').innerHTML= data.dev_standard_3_description;
        };

        // FIX: Separate model from controller
        new PageModel().fetch({data: {type: 'books.BookIndex'}}).then((result) => {
            if (result.pages.length === 0) {
                return;
            }

            const id = result.pages[0].id;
            const detailPage = new PageModel({id});

            detailPage.fetch().then(populateBookInfoFields);
        });

        for (const button of filterButtons) {
            this.regions.filterButtons.append(new FilterButton(button, this.model));
        }

        // FIX: Separate model from controller
        this.otherPromises.push(new Promise((resolve) => {
            new PageModel().fetch({data: {
                type: 'books.Book',
                fields: ['title', 'subject_name', 'is_ap,cover_url',
                'high_resolution_pdf_url', 'low_resolution_pdf_url',
                'ibook_link', 'ibook_link_volume_2',
                'webview_link', 'concept_coach_link,bookshare_link',
                'amazon_link', 'amazon_price', 'amazon_blurb',
                'bookstore_link', 'bookstore_blurb', 'slug'],
                limit: 50
            }}).then((result) => {
                this.renderCategorySections(organizeBooksByCategory(result.pages));
                resolve();
            });
        }));
    }
    */

}
