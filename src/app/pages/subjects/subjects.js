import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import PageModel from '~/models/pagemodel';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './subjects.hbs';
import FilterButton from './filter-button/filter-button';
import CategorySection from './category-section/category-section';

const categories = ['Math', 'Science', 'Social Sciences', 'History', 'AP®'];

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

@props({
    template: template,
    regions: {
        filterButtons: '.filter-buttons',
        bookViewer: '.books-by-category'
    }
})
export default class Subjects extends BaseView {
    @on('click')
    deselect() {
        this.model.set('selectedBook', false);
    }

    constructor() {
        super();
        this.model = new BaseModel({
            filterButtons: ['View All', ...categories],
            selectedFilter: 'View All',
            selectedBook: null
        });
    }

    renderCategorySections(booksByCategory) {
        for (let category of categories) {
            this.regions.bookViewer.append(new CategorySection(category, booksByCategory[category], this.model));
        }
    }

    onRender() {
        this.el.classList.add('text-content');

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

        for (let button of this.model.get('filterButtons')) {
            this.regions.filterButtons.append(new FilterButton(button, this.model));
        }

        new PageModel().fetch({data: {
            type: 'books.Book',
            fields: 'title,subject_name,is_ap,cover_url'
        }}).then((result) => {
            this.renderCategorySections(organizeBooksByCategory(result.pages));
        });
    }
}
