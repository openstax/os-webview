import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import PageModel from '~/models/pagemodel';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './subjects.hbs';
import FilterButton from '~/components/filter-button/filter-button';
import {template as strips} from '~/components/strips/strips.hbs';
import CategorySection from './category-section/category-section';
import router from '~/router';

const categories = ['Math', 'Science', 'Social Sciences', 'History', 'AP®'],
    filterButtons = ['View All', ...categories];

function organizeBooksByCategory(books) {
    let result = {
        'AP®': []
    };

    for (let book of books) {
        if (!(book.subject_name in result)) {
            result[book.subject_name] = [];
        }
        result[book.subject_name].push(book);
        if (book.is_ap) {
            result['AP®'].push(book);
        }
    }

    return result;
}

function canonicalSubject(string) {
    return string.toLowerCase().match(/(\w+)/g).join(' ');
}

@props({
    template: template,
    templateHelpers: {strips},
    regions: {
        filterButtons: '.filter-buttons',
        bookViewer: '.books .container'
    }
})
export default class Subjects extends BaseView {
    @on('click')
    deselect() {
        this.model.set('selectedBook', false);
    }

    updateSelectedFilterFromPath() {
        let pathMatch = window.location.pathname.match(/\/subjects\/(.+)/),
            selectedFilter = 'View All';

        if (pathMatch) {
            let subject = canonicalSubject(pathMatch[1]);

            for (let c of categories) {
                if (canonicalSubject(c) === subject) {
                    selectedFilter = c;
                }
            }
        }
        this.model.set('selectedFilter', selectedFilter);
    }

    constructor() {
        super();

        this.model = new BaseModel({
            selectedFilter: 'View All',
            selectedBook: null
        });

        this.listenTo(router, 'route', this.updateSelectedFilterFromPath);
        this.updateSelectedFilterFromPath();
    }

    renderCategorySections(booksByCategory) {
        for (let category of categories) {
            this.regions.bookViewer.append(new CategorySection(category, booksByCategory[category], this.model));
        }
    }

    @on('click .filter')
    openCategories() {
        this.toggleOpenCategories();
    }

    toggleOpenCategories() {
        let w = window.innerWidth;

        if (w<=768) {
            this.el.querySelector('.filter-buttons').classList.toggle('active');
        }
    }

    removeOpenCategories() {
        document.querySelector('.filter-buttons').classList.remove('active');
    }


    onRender() {
        let populateBookInfoFields = (data) => {
            let findNode = (name) =>
                this.el.querySelector(`[data-manager="${name}"]`);

            findNode('page-description').innerHTML = data.page_description;
            findNode('ds1-head').textContent = data.dev_standard_1_heading;
            findNode('ds2-head').textContent = data.dev_standard_2_heading;
            findNode('ds3-head').textContent = data.dev_standard_3_heading;
            findNode('ds1-body').innerHTML= data.dev_standard_1_description;
            findNode('ds2-body').innerHTML= data.dev_standard_2_description;
            findNode('ds3-body').innerHTML= data.dev_standard_3_description;
        };

        new PageModel().fetch({data: {type: 'books.BookIndex'}}).then((result) => {
            let id = result.pages[0].id,
                detailPage = new PageModel({id});

            detailPage.fetch().then(populateBookInfoFields);
        });

        for (let button of filterButtons) {
            this.regions.filterButtons.append(new FilterButton(button, this.model));
        }

        new PageModel().fetch({data: {
            type: 'books.Book',
            fields: 'title,subject_name,is_ap,cover_url,high_resolution_pdf_url,ibook_link,webview_link,slug'
        }}).then((result) => {
            this.renderCategorySections(organizeBooksByCategory(result.pages));
        });

        window.addEventListener('resize', this.removeOpenCategories.bind(this));
    }

    onBeforeClose() {
        window.removeEventListener('resize', this.removeOpenCategories.bind(this));
    }
}
