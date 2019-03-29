import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
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

    for (const book of books) {
        book.subjects.forEach((cmsCategory) => {
            if (!(cmsCategory in result)) {
                result[cmsCategory] = [];
            }
            result[cmsCategory].push(book);
        });
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
        this.books = books;
    }

    update() {
        // No updating!
    }

    onLoaded() {
        CategorySelector.loaded.then(() => {
            const categorizedBooks = organizeBooksByCategory(this.books);

            this.categorySections = CategorySelector.categories
                .filter((c) => c.value !== 'view-all')
                .map(
                    (category) => new CategorySection(category.value, categorizedBooks[category.cms])
                );
            for (const controller of this.categorySections) {
                this.regions.self.append(controller);
            }
            if (this.filterToCategory) {
                this.filterSubjects(this.filterToCategory);
            }
        });
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
