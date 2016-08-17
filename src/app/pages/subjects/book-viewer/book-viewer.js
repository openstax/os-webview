import {Controller} from 'superb';
import CategorySelector from '~/components/category-selector/category-selector';
import CategorySection from './category-section/category-section';

const apId = 'AP';

function organizeBooksByCategory(books) {
    const result = {};
    const addLabels = () => {
        for (const category of CategorySelector.categories) {
            if (result[category.cms]) {
                result[category.cms].label = category.html;
            }
        }
    };

    result[apId] = [];

    for (const slug of Object.keys(books)) {
        const book = books[slug];
        const cmsCategory = book.subject;

        book.slug = slug;
        if (!(cmsCategory in result)) {
            result[cmsCategory] = [];
        }
        result[cmsCategory].push(book);
        if (book.is_ap) {
            result[apId].push(book);
        }
    }

    addLabels();

    return result;
}

export default class BookViewer extends Controller {

    init(books) {
        this.template = () => '';
/*
        this.query = {
            type: 'books.Book',
            fields: ['title', 'subject_name', 'is_ap,cover_url',
            'high_resolution_pdf_url', 'low_resolution_pdf_url',
            'ibook_link', 'ibook_link_volume_2',
            'webview_link', 'concept_coach_link,bookshare_link',
            'amazon_link', 'amazon_price', 'amazon_blurb',
            'bookstore_link', 'bookstore_blurb', 'slug'],
            limit: 50
        };
        */
        this.view = {
            classes: ['container']
        };
        this.books = books;
    }

    onLoaded() {
        const categorizedBooks = organizeBooksByCategory(this.books);

        this.categorySections = CategorySelector.categories.map(
            (category) => new CategorySection(category.cms, categorizedBooks[category.cms])
        );
        for (const controller of this.categorySections) {
            this.regions.self.append(controller);
        }
        if (this.filterToCategory) {
            this.filterCategories(this.filterToCategory);
        }
    }

    filterCategories(category) {
        if (!this.categorySections) {
            this.filterToCategory = category;
            return;
        }
        for (const controller of this.categorySections) {
            controller.filter(category);
        }
    }

}
