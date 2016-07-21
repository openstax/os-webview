import router from '~/router';
import CMSPageController from '~/controllers/cms';
import cms from '~/helpers/cms';
import CategorySelector from '~/components/category-selector/category-selector';
import CategorySection from './category-section/category-section';
import {description as template} from './subjects.html';

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
        const cmsCategory = book.subject_name;

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

const dataPromises = Promise.all([
    cms.getPage({
        title: 'Subjects'
    }),
    cms.query({
        type: 'books.Book',
        fields: ['title', 'subject_name', 'is_ap,cover_url',
        'high_resolution_pdf_url', 'low_resolution_pdf_url',
        'ibook_link', 'ibook_link_volume_2',
        'webview_link', 'concept_coach_link,bookshare_link',
        'amazon_link', 'amazon_price', 'amazon_blurb',
        'bookstore_link', 'bookstore_blurb', 'slug'],
        limit: 50
    })
]);


export default class Subjects extends CMSPageController {

    static description = `Our textbooks are openly licensed, peer-reviewed,
       free, and backed by learning resources. Check out our books and
       decide if they're right for your course.`;

    init() {
        this.template = template;
        this.css = '/app/pages/subjects/subjects.css';
        this.view = {
            classes: ['subjects-page']
        };
        this.regions = {
            filter: '.filter',
            bookViewer: '.books .container'
        };
        this.model = {};

        dataPromises.then((results) => {
            const [pageData, bookData] = results;

            document.title = `${pageData.title} - OpenStax`;
            this.model = pageData;
            const categorizedBooks = organizeBooksByCategory(bookData.pages);

            this.categorySections = CategorySelector.categories.map(
                (category) => new CategorySection(category.cms, categorizedBooks[category.cms])
            );
            this.renderCategorySections(categorizedBooks);
            this.update();

            const htmlEls = this.el.querySelectorAll('[data-html]');

            for (const el of htmlEls) {
                el.innerHTML = this.model[el.dataset.html];
            }
        });

        this.filterCategoriesEvent = () => this.filterCategories(history.state.filter);
        window.addEventListener('popstate', this.filterCategoriesEvent);
    }

    filterCategories(category) {
        for (const view of this.categorySections) {
            if (category === '' || category === view.category) {
                view.el.classList.remove('hidden');
            } else {
                view.el.classList.add('hidden');
            }
        }
    }

    onLoaded() {
        const setCategory = (category) => {
            const slug = CategorySelector.byCms[category].slug;

            router.navigate(`/subjects/${slug}`, {path: '/subjects'}, {ignore: true});
            this.filterCategories(category);
        };
        const categorySelectorView = new CategorySelector(setCategory);

        this.regions.filter.attach(categorySelectorView);

        dataPromises.then(() => {
            const slug = decodeURIComponent(window.location.pathname).replace(/.*subjects/, '').substr(1) || 'view-all';
            const category = CategorySelector.bySlug[slug];

            if (!category) {
                return;
            }
            categorySelectorView.updateSelected(category.cms);
        });
    }

    renderCategorySections(booksByCategory) {
        for (const view of this.categorySections) {
            this.regions.bookViewer.append(view);
        }
    }

    onClose() {
        window.removeEventListener('popstate', this.filterCategoriesEvent);
    }

}
