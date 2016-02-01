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

let jsonData = () => (
    {
        'id': 5,
        'meta': {
            'type': 'books.BookIndex',
            'detail_url': 'http://oscms-dev.openstax.org/api/v1/pages/5/'
        },
        'parent': {
            'id': 3,
            'meta': {
                'type': 'pages.HomePage',
                'detail_url': 'http://oscms-dev.openstax.org/api/v1/pages/3/'
            }
        },
        'title': 'OpenStax Books',
        'page_description': `<h1>Open source. Peer-reviewed. 100% free.</h1>
         <p>And backed by additional learning resources. Review our OpenStax textbooks
          and decide if they’re right for your course. Simple to adopt, free to use.
          We make it easy to improve student access to higher education.</p>`,
        'dev_standards_heading': 'Development Standards',
        'dev_standard_1_heading': 'Content Development',
        'dev_standard_1_description': `<p>Our open source textbooks are written by
         professional content developers who are experts in their fields.</p>`,
        'dev_standard_2_heading': 'Standard Organization',
        'dev_standard_2_description': `<p>All textbooks meet standard scope and
         sequence requirements, making them seamlessly adaptable into existing
         courses.</p>`,
        'dev_standard_3_heading': 'Peer Review',
        'dev_standard_3_description': `<p>OpenStax textbooks undergo a rigorous
         peer review process. You can view the list of contributors when you
         click on each book.</p>`
    }
);

let dummyData = () => {
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
};

function stateData() {
    let selectedFilter = 'View All',
        selectedBook = null;

    return {
        selectedFilter,
        selectedBook
    };
}

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
        this.model = new BaseModel({viewIsReady: false});

        let updateBookIndexInfo = () => {
            let setHtmlToMember = (nodeName, memberName) => {
                this.el.querySelector(`[data-manager="${nodeName}"]`)
                .innerHTML = this.model.get('bookIndex')[memberName];
            };

            if (this.model.get('viewIsReady') &&
                this.model.has('bookIndex')) {
                setHtmlToMember('page-description', 'page_description');
                setHtmlToMember('ds1-head', 'dev_standard_1_heading');
                setHtmlToMember('ds1-body', 'dev_standard_1_description');
                setHtmlToMember('ds2-head', 'dev_standard_2_heading');
                setHtmlToMember('ds2-body', 'dev_standard_2_description');
                setHtmlToMember('ds3-head', 'dev_standard_3_heading');
                setHtmlToMember('ds3-body', 'dev_standard_3_description');
            }
        };

        this.model.on('change:bookIndex change:viewIsReady', updateBookIndexInfo);

        this.model.on('change:filterButtons change:viewIsReady', () => {
            if (this.model.get('viewIsReady') &&
                this.model.has('filterButtons')) {
                let buttons = this.model.get('filterButtons'),
                    region = this.regions.filterButtons;

                for (let button of buttons) {
                    region.append(new FilterButton(button, this.model));
                }
            }
        });

        this.model.on('change:booksByCategory change:viewIsReady', () => {
            if (this.model.get('viewIsReady') &&
                this.model.has('booksByCategory')) {
                let categories = this.model.get('booksByCategory'),
                    region = this.regions.bookViewer;

                for (let category of categories) {
                    region.append(new CategorySection(category, this.model));
                }
            }
        });

        this.model.set('bookIndex', {
            'id': 5,
            'meta': {
                'type': 'books.BookIndex',
                'detail_url': 'http://oscms-dev.openstax.org/api/v1/pages/5/'
            },
            'parent': {
                'id': 3,
                'meta': {
                    'type': 'pages.HomePage',
                    'detail_url': 'http://oscms-dev.openstax.org/api/v1/pages/3/'
                }
            },
            'title': 'OpenStax Books',
            'page_description': `<h1>Open source. Peer-reviewed. 100% free.</h1>
             <p>And backed by additional learning resources. Review our OpenStax textbooks
              and decide if they’re right for your course. Simple to adopt, free to use.
              We make it easy to improve student access to higher education.</p>`,
            'dev_standards_heading': 'Development Standards',
            'dev_standard_1_heading': 'Content Development',
            'dev_standard_1_description': `<p>Our open source textbooks are written by
             professional content developers who are experts in their fields.</p>`,
            'dev_standard_2_heading': 'Standard Organization',
            'dev_standard_2_description': `<p>All textbooks meet standard scope and
             sequence requirements, making them seamlessly adaptable into existing
             courses.</p>`,
            'dev_standard_3_heading': 'Peer Review',
            'dev_standard_3_description': `<p>OpenStax textbooks undergo a rigorous
             peer review process. You can view the list of contributors when you
             click on each book.</p>`
        });

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
        this.model.set('viewIsReady', true);
    }
}
