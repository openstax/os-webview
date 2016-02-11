import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import {props} from '~/helpers/backbone/decorators';
import {template} from './subjects.hbs';
import FilterButton from './filter-button/filter-button';
import CategorySection from './category-section/category-section';

function makeBook(title, categories) {
    return {
        title,
        categories,
        coverUrl: `https://placeholdit.imgix.net/~text?txtsize=33&txt=${title}&w=200&h=180`
    };
}

const BookInfoModel = BaseModel.extend({
    url: 'https://oscms-dev.openstax.org/api/v1/pages/7/'
});

@props({
    template: template,
    regions: {
        filterButtons: '.filter-buttons',
        bookViewer: '.book-viewer'
    }
})
export default class Subjects extends BaseView {

    constructor() {
        super();
        this.model = new BaseModel();

        this.model.set((() => {
            let categories = [
                    'Math', 'Science', 'Social Sciences', 'History', 'AP'
                ],
                filterButtons = ['View All', ...categories],
                books = [
                    makeBook('Math 1', ['Math']),
                    makeBook('Math AP', ['Math', 'AP']),
                    makeBook('Math 2', ['Math']),
                    makeBook('Math 3', ['Math']),
                    makeBook('History 1', ['History']),
                    makeBook('History 2', ['History']),
                    makeBook('Science 1', ['Science']),
                    makeBook('Science 2', ['Science']),
                    makeBook('Science AP', ['Science', 'AP']),
                    makeBook('Social', ['Social Sciences'])
                ],
                booksByCategory = categories.map((category) => (
                    {
                        category,
                        books: books.filter((aBook) => aBook.categories.indexOf(category) >= 0)
                            .map((book) => ({
                                title: book.title,
                                coverUrl: book.coverUrl
                            }))
                    }
                ));

            return {
                filterButtons,
                booksByCategory
            };
        })());

        this.model.set({
            selectedFilter: 'View All',
            selectedBook: null
        });
    }

    onRender() {
        this.el.classList.add('text-content');

        let bookInfoModel = new BookInfoModel();

        bookInfoModel.fetch({
            success: () => {
                let setHtmlToMember = (nodeName, memberName) => {
                    this.el.querySelector(`[data-manager="${nodeName}"]`)
                    .innerHTML = bookInfoModel.get(memberName);
                };

                setHtmlToMember('page-description', 'page_description');
                setHtmlToMember('ds1-head', 'dev_standard_1_heading');
                setHtmlToMember('ds1-body', 'dev_standard_1_description');
                setHtmlToMember('ds2-head', 'dev_standard_2_heading');
                setHtmlToMember('ds2-body', 'dev_standard_2_description');
                setHtmlToMember('ds3-head', 'dev_standard_3_heading');
                setHtmlToMember('ds3-body', 'dev_standard_3_description');
            }
        });

        let buttons = this.model.get('filterButtons');

        for (let button of buttons) {
            this.regions.filterButtons.append(new FilterButton(button, this.model));
        }

        let categories = this.model.get('booksByCategory');

        for (let category of categories) {
            this.regions.bookViewer.append(new CategorySection(category, this.model));
        }
    }
}
