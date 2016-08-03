import LoadingView from '~/helpers/backbone/loading-view';
import BaseModel from '~/helpers/backbone/model';
import $ from '~/helpers/$';
import PageModel from '~/models/pagemodel';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './subjects.hbs';
import FilterButton from '~/components/filter-button/filter-button';
import {template as strips} from '~/components/strips/strips.hbs';
import CategorySection from './category-section/category-section';
import router from '~/router';

const apId = 'AP<sup>&reg;</sup>',
    categories = ['Math', 'Science', 'Social Sciences', 'Humanities', apId],
    filterButtons = ['View All', ...categories];

function organizeBooksByCategory(books) {
    let result = {};

    result[apId] = [];

    for (let book of books) {
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

@props({
    template: template,
    css: '/app/pages/subjects/subjects.css',
    templateHelpers: {strips},
    regions: {
        filterButtons: '.filter-buttons',
        bookViewer: '.books .container'
    }
})
export default class Subjects extends LoadingView {

    @on('click')
    deselect() {
        this.model.set('selectedBook', false);
    }

    @on('click .filter')
    filterClick(e) {
        const filterSection = this.el.querySelector('.filter');
        const buttonText = e.target.textContent;
        const routeTo = buttonText === 'View All' ? '/subjects' : `/subjects/${buttonText}`;

        $.scrollTo(filterSection, 30);
        router.navigate(routeTo, false);
    }

    static metaDescription = () => `Our textbooks are openly licensed, peer-reviewed, free,
        and backed by learning resources. Check out our books and decide if they’re
        right for your course.`;

    updateSelectedFilterFromPath() {
        let pathMatch = window.location.pathname.match(/\/subjects\/(.+)/),
            selectedFilter = 'View All';

        if (pathMatch) {
            let subject = FilterButton.canonicalSubject(pathMatch[1]);

            for (let c of categories) {
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

    onLoaded() {
        super.onLoaded();
        this.el.querySelector('.subjects-page').classList.remove('hidden');
    }

    onRender() {
        let populateBookInfoFields = (data) => {
            let findNode = (name) => this.el.querySelector(`[data-manager="${name}"]`);

            findNode('page-description').innerHTML = data.page_description;
            findNode('ds1-head').textContent = data.dev_standard_1_heading;
            findNode('ds2-head').textContent = data.dev_standard_2_heading;
            findNode('ds3-head').textContent = data.dev_standard_3_heading;
            findNode('ds1-body').innerHTML= data.dev_standard_1_description;
            findNode('ds2-body').innerHTML= data.dev_standard_2_description;
            findNode('ds3-body').innerHTML= data.dev_standard_3_description;
        };

        new PageModel().fetch({data: {type: 'books.BookIndex'}}).then((result) => {
            if (result.pages.length === 0) {
                return;
            }
            let id = result.pages[0].id,
                detailPage = new PageModel({id});

            detailPage.fetch().then(populateBookInfoFields);
        });

        for (let button of filterButtons) {
            this.regions.filterButtons.append(new FilterButton(button, this.model));
        }

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
        super.onRender();
    }

}
