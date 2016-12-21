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
    const compareByComingSoon = (a, b) => {
        if (a.coming_soon) {
            return b.coming_soon ? 0 : 1;
        }
        return b.coming_soon ? -1 : 0;
    };
    const compareSlugsByTitle = (a, b) => {
        const bA = books[a];
        const bB = books[b];

        return compareByComingSoon(bA, bB) || bA.title.localeCompare(bB.title);
    };

    result[apId] = [];

    for (const slug of Object.keys(books).sort(compareSlugsByTitle)) {
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
