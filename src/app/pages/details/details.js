import $ from '~/helpers/$';
import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import ContentGroup from '~/components/content-group/content-group';
import DetailsTab from './details-tab/details-tab';
import getCompCopyDialogProps from './comp-copy-dialog-props';
import InstructorResourceTab from './instructor-resource-tab/instructor-resource-tab';
import PhoneView from './phone-view/phone-view';
import StudentResourceTab from './student-resource-tab/student-resource-tab';
import TabGroup from '~/components/tab-group/tab-group';
import userModel from '~/models/usermodel';
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
        this.css = `/app/pages/details/details.css?${VERSION}`;
        this.regions = {
            phoneView: '.phone-view',
            tabController: '.tab-controller',
            tabContent: '.tab-content'
        };
        this.view = {
            classes: ['details-page-v2']
        };

        this.bookTitle = 'Loading';
        this.slug = getSlugFromTitle(bookTitle.toLowerCase());
        this.userStatusPromise = this.getUserStatusPromise();
        this.reverseGradient = false;
        this.titleImage = null;

        this.model = () => this.getModel();
    }

    getModel() {
        const model = {
            slug: this.slug,
            bookTitle: this.bookTitle,
            titleImage: this.titleImage,
            reverseGradient: this.reverseGradient
        };

        return model;
    }

    getUserStatusPromise() {
        const isInstructor = (user) => {
            return user && user.username && 'groups' in user && user.groups.includes('Faculty');
        };
        const isStudent = (user) => {
            return user && user.username && !isInstructor(user);
        };

        return userModel.load().then((user) => {
            return {
                isInstructor: isInstructor(user),
                isStudent: isStudent(user),
                pendingVerification: user.pending_verification,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                userInfo: user
            };
        });
    }

    onLoaded() {
        document.body.classList.remove('page-loaded');
        document.body.classList.add('page-loading');
    }

    onDataLoaded() {
        if (this.pageData.meta.type !== 'books.Book') {
            window.location = '/_404';
            return;
        }
        document.body.classList.remove('page-loading');
        document.body.classList.add('page-loaded');
        document.title = `${this.pageData.title} - OpenStax`;
        const polish = $.isPolish(this.pageData.title);
        const tabLabels = [polish ? 'Szczegóły książki' : 'Book details'];
        let selectedTab = decodeURIComponent(window.location.search.replace('?', '')) || tabLabels[0];
        const detailsTabData = () => {
            /* eslint complexity: 0 */
            const model = {
                bookInfo: this.pageData,
                bookState: this.pageData.book_state,
                description: this.pageData.description,
                errataBlurb: this.pageData.errata_content.content && this.pageData.errata_content.content.content,
                formattedPublishDate: this.pageData.publish_date && formatDate(this.pageData.publish_date),
                polish,
                slug: this.slug,
                title: this.pageData.title,
                salesforceAbbreviation: this.pageData.salesforce_abbreviation
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
        const compCopyDialogProps = getCompCopyDialogProps(
            {
                title: this.pageData.title,
                coverUrl: this.pageData.cover_url,
                prompt: (this.pageData.comp_copy_content || ['Request your complimentary iBooks download'])[0]
            },
            this.userStatusPromise
        );

        const contents = polish ?
            {
                'Szczegóły książki': new DetailsTab(detailsTabData())
            } :
            {
                'Book details': new DetailsTab(detailsTabData())
            };

        if (!polish && this.pageData.free_stuff_instructor.content) {
            contents['Instructor resources'] = new InstructorResourceTab(
                {
                    resources: this.pageData.book_faculty_resources,
                    allies: shuffle(this.pageData.book_allies),
                    userStatusPromise: this.userStatusPromise,
                    freeStuff: {
                        heading: this.pageData.free_stuff_instructor.content.heading,
                        blurb: this.pageData.free_stuff_instructor.content.content
                    },
                    webinar: {
                        text: this.pageData.webinar_content.content.heading,
                        url: this.pageData.webinar_content.link,
                        blurb: this.pageData.webinar_content.content.content
                    },
                    communityResource: {
                        heading: this.pageData.community_resource_heading,
                        logoUrl: this.pageData.community_resource_logo_url,
                        url: this.pageData.community_resource_url,
                        cta: this.pageData.community_resource_cta,
                        blurb: this.pageData.community_resource_blurb,
                        featureUrl: this.pageData.community_resource_feature_link_url,
                        featureText: this.pageData.community_resource_feature_text
                    },
                    ally: {
                        heading: this.pageData.ally_content.content.heading,
                        blurb: this.pageData.ally_content.content.content
                    }
                },
                compCopyDialogProps
            );
            tabLabels.push('Instructor resources');
        }

        if (!polish && this.pageData.free_stuff_student.content) {
            contents['Student resources'] = new StudentResourceTab({
                freeStuff: {
                    heading: this.pageData.free_stuff_student.content.heading,
                    blurb: this.pageData.free_stuff_student.content.content
                },
                resources: this.pageData.book_student_resources,
                userStatusPromise: this.userStatusPromise
            });
            tabLabels.push('Student resources');
        }

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
                window.history.replaceState({}, selectedTab, `?${selectedTab}`);
                window.dispatchEvent(new CustomEvent('navigate'));
            }
        }));

        this.bookTitle = this.pageData.title;
        this.slug = this.pageData.slug;
        setDetailsTabClass();

        this.el.classList.add(this.pageData.cover_color.toLowerCase());
        this.reverseGradient = this.pageData.reverse_gradient;
        this.titleImage = this.pageData.title_image_url;

        this.update();

        this.regions.phoneView.attach(new PhoneView({
            bookInfo: this.pageData,
            bookTitle: this.bookTitle,
            detailsTabData: detailsTabData(),
            errataContent: this.pageData.errata_content,
            instructorResources: {
                freeResources: this.pageData.book_faculty_resources,
                paidResources: this.pageData.book_allies
            },
            slug: this.slug,
            salesforceAbbreviation: this.pageData.salesforce_abbreviation,
            studentResources: this.pageData.book_student_resources,
            tableOfContents: this.pageData.table_of_contents,
            userStatusPromise: this.userStatusPromise,
            webviewLink: this.pageData.webview_link,
            compCopyDialogProps
        }));
        this.regions.tabController.attach(tabGroup);
        this.regions.tabContent.attach(contentGroup);
    }

}
