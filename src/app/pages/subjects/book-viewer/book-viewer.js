import {Controller} from 'superb.js';
import CategorySelector from '~/components/category-selector/category-selector';
import CategorySection from './category-section/category-section';

function organizeBooksByCategory(books) {
    const result = {};
    const addLabels = () => {
        for (const category of CategorySelector.categories) {
            if (result[category.cms]) {
                result[category.cms].label = category.html;
            }
        }
    };

    for (const book of books) {
        book.subjects.forEach((cmsCategory) => {
            if (!(cmsCategory in result)) {
                result[cmsCategory] = [];
            }
            if (!result[cmsCategory].includes(book)) {
                result[cmsCategory].push(book);
            }
        });
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
