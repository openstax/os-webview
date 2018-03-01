import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import PhoneView from './phone-view/phone-view';
import DetailsTab from './details-tab/details-tab';
import InstructorResourceTab from './instructor-resource-tab/instructor-resource-tab';
import StudentResourceTab from './student-resource-tab/student-resource-tab';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group';
import {sfUserModel} from '~/models/usermodel';
import {formatDateForBlog as formatDate, shuffle} from '~/helpers/data';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './details.html';

function getSlugFromTitle(bookTitle) {
    let slug;

    if (/^books/.test(bookTitle)) {
        slug = bookTitle;
    } else {
        slug = `books/${bookTitle}`;
    }
    // Special handling for books whose slugs have changed
    if (/university-physics$/.test(slug)) {
        slug += '-volume-1';
    }

    return slug;
}

const slugToColor = {
    prealgebra: 'deep-green',
    'elementary-algebra': 'orange',
    'intermediate-algebra': 'blue',
    'college-algebra': 'light-blue',
    'algebra-and-trigonometry': 'red',
    'precalculus': 'orange',
    'calculus-volume': 'gold',
    'introductory-statistics': 'yellow',
    'anatomy-and-physiology': 'gray',
    'astronomy': 'blue',
    'biology': 'green',
    'concepts-biology': 'orange',
    'microbiology': 'light-blue',
    'chemistry': 'orange',
    'chemistry-atoms-first': 'deep-green',
    'college-physics': 'blue',
    'university-physics-volume': 'green',
    'american-government': 'light-blue',
    'principles-economics': 'gray',
    'principles-macroeconomics': 'gray',
    'principles-microeconomics': 'gray',
    psychology: 'green',
    'introduction-sociology-2e': 'yellow',
    'us-history': 'blue',
    'college-physics-ap-courses': 'blue',
    'principles-macroeconomics-ap-courses': 'gray',
    'principles-microeconomics-ap-courses': 'gray',
    'fizyka-uniwersytecka-polska': 'green'
};

function getColorFromSlug(slug) {
    const stripped = slug.replace(/.*\/(.*[^\-\d]).*/, '$1');

    return slugToColor[stripped] || 'gray';
}

export default class Details extends CMSPageController {

    init(bookTitle) {
        this.template = template;
        this.model = {
            bookTitle: 'loading'
        };
        this.css = `/app/pages/details-new/details.css?${VERSION}`;
        this.regions = {
            phoneView: '.phone-view',
            tabController: '.tab-controller',
            tabContent: '.tab-content'
        };
        this.slug = getSlugFromTitle(bookTitle.toLowerCase());
        this.view = {
            classes: ['details-page-v2']
        };
        this.checkUserStatus();
    }

    checkUserStatus() {
        const isInstructor = (user) => {
            return user && user.username && 'groups' in user && user.groups.includes('Faculty');
        };
        const isStudent = (user) => {
            return user && user.username && !isInstructor(user);
        };

        this.model.userStatusPromise = sfUserModel.load().then((user) => {
            return {
                isInstructor: isInstructor(user),
                isStudent: isStudent(user)
            };
        });
    }

    onDataLoaded() {
        const tabLabels = ['Book details', 'Instructor resources', 'Student resources'];
        let selectedTab = tabLabels[0];
        const detailsTabData = () => {
            /* eslint complexity: 0 */
            const model = {
                description: this.pageData.description,
                title: this.pageData.title,
                comingSoon: this.pageData.coming_soon ? ' coming-soon' : '',
                formattedPublishDate: this.pageData.publish_date && formatDate(this.pageData.publish_date),
                bookInfo: this.pageData,
                slug: this.slug
            };
            const authors = this.pageData.book_contributing_authors;
            const senior = (author) => author.senior_author;
            const nonsenior = (author) => !author.senior_author;

            model.allSenior = authors.filter(senior);
            model.allNonsenior = authors.filter(nonsenior);
            for (const key of Object.keys(this.pageData)) {
                if (key.match(/isbn|license/)) {
                    model[key] = this.pageData[key];
                }
            }
            if (model.license_name) {
                model.licenseIcon = model.license_name.match(/share/i) ?
                    '/images/details/by-nc-sa.svg' : '/images/details/by.svg';
            }

            return model;
        };
        const contents = {
            'Book details': new DetailsTab(detailsTabData()),
            'Instructor resources': new InstructorResourceTab({
                resources: this.pageData.book_faculty_resources,
                allies: shuffle(this.pageData.book_allies),
                userStatusPromise: this.model.userStatusPromise
            }),
            'Student resources': new StudentResourceTab({
                resources: this.pageData.book_student_resources,
                userStatusPromise: this.model.userStatusPromise
            })
        };
        const contentGroup = new ContentGroup(() => ({
            selectedTab,
            contents
        }));
        const setDetailsTabClass = () => {
            this.el.classList.toggle('card-background', selectedTab !== 'Book details');
        };
        const tabGroup = new TabGroup(() => ({
            tag: 'h2',
            tabLabels,
            selectedTab,
            setSelected(newValue) {
                selectedTab = newValue;
                setDetailsTabClass();
                contentGroup.update();
            }
        }));

        this.model.bookTitle = this.pageData.title;
        this.model.slug = this.pageData.slug;
        setDetailsTabClass();
        this.update();

        this.el.classList.add(getColorFromSlug(this.pageData.slug));

        this.regions.phoneView.attach(new PhoneView({
            bookInfo: this.pageData,
            detailsTabData: detailsTabData(),
            tableOfContents: this.pageData.table_of_contents,
            bookTitle: this.model.bookTitle,
            slug: this.model.slug,
            instructorResources: {
                freeResources: this.pageData.book_faculty_resources,
                paidResources: this.pageData.book_allies
            },
            studentResources: this.pageData.book_student_resources,
            userStatusPromise: this.model.userStatusPromise
        }));
        this.regions.tabController.attach(tabGroup);
        this.regions.tabContent.attach(contentGroup);
    }

}
