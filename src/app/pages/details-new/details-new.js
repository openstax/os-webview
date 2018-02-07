import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import DetailsTab from './details-tab/details-tab';
import InstructorResourceTab from './instructor-resource-tab/instructor-resource-tab';
import StudentResourceTab from './student-resource-tab/student-resource-tab';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group';
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


export default class Details extends CMSPageController {

    init(bookTitle) {
        this.template = template;
        this.model = {
            bookTitle: 'loading'
        };
        this.css = `/app/pages/details-new/details.css?${VERSION}`;
        this.regions = {
            tabController: '.tab-controller',
            tabContent: '.tab-content'
        };
        this.slug = getSlugFromTitle(bookTitle.toLowerCase());
    }

    onDataLoaded() {
        this.model.bookTitle = this.pageData.title;
        this.model.slug = this.pageData.slug;
        this.update();

        const tabLabels = ['Book details', 'Instructor resources', 'Student resources'];
        let selectedTab = tabLabels[0];
        const detailsTabData = () => {
            /* eslint complexity: 0 */
            const model = {
                description: this.pageData.description,
                title: this.pageData.title,
                comingSoon: this.pageData.coming_soon ? ' coming-soon' : '',
                formattedPublishDate: this.pageData.publish_date && formatDate(this.pageData.publish_date),
                bookInfo: this.pageData
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
                allies: shuffle(this.pageData.book_allies)
            }),
            'Student resources': new StudentResourceTab({
                resources: this.pageData.book_student_resources
            })
        };
        const contentGroup = new ContentGroup(() => ({
            selectedTab,
            contents
        }));
        const tabGroup = new TabGroup(() => ({
            tag: 'h2',
            tabLabels,
            selectedTab,
            setSelected(newValue) {
                selectedTab = newValue;
                contentGroup.update();
            }
        }));

        this.regions.tabController.attach(tabGroup);
        this.regions.tabContent.attach(contentGroup);
    }

}
