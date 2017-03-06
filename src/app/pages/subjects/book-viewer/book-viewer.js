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
    // Transitioning to array from Object
    // FIX: just use books instead of bookList
    const bookList = books.length ? books : Object.keys(books).map((slug) => {
        const book = books[slug];

        book.slug = slug;
        return book;
    });

    for (const book of bookList) {
        const cmsCategory = book.subject;

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
        this.view = {
            classes: ['container']
        };
        const categorizedBooks = organizeBooksByCategory(books);

        this.categorySections = CategorySelector.categories.map(
            (category) => new CategorySection(category.cms, categorizedBooks[category.cms])
        );
    }

    onLoaded() {
        for (const controller of this.categorySections) {
            this.regions.self.append(controller);
        }
        if (this.filterToCategory) {
            this.filterCategories(this.filterToCategory);
        }
    }

    filterSubjects(category) {
        if (!this.categorySections) {
            this.filterToCategory = category;
            return;
        }
        for (const controller of this.categorySections) {
            controller.filter(category);
        }
    }

}
