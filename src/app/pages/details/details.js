import $ from '~/helpers/$';
import componentType, {canonicalLinkMixin, loaderMixin} from '~/helpers/controller/init-mixin';
import ContentGroup from '~/components/content-group/content-group';
import DetailsTab from './details-tab/details-tab';
import getCompCopyDialogProps from './comp-copy-dialog-props';
import InstructorResourceTab from './instructor-resource-tab/instructor-resource-tab';
import PartnersTab from './partners-tab/partners-tab';
import PhoneView from './phone-view/phone-view';
import StudentResourceTab from './student-resource-tab/student-resource-tab';
import TabGroup from '~/components/tab-group/tab-group';
import userModel from '~/models/usermodel';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import {shuffle} from 'lodash';
import {description as template} from './details.html';
import css from './details.css';

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

const spec = {
    template,
    css,
    view: {
        classes: ['details-page-v2'],
        tag: 'main'
    },
    regions: {
        phoneView: '.phone-view',
        tabController: '.tab-controller',
        tabContent: '.tab-content'
    },
    slug: '',
    model() {
        return {
            slug: this.slug,
            bookTitle: this.bookTitle,
            titleImage: this.titleImage,
            reverseGradient: this.reverseGradient
        };
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin, loaderMixin);

export default class Details extends BaseClass {

    init() {
        const bookTitle = window.location.pathname.replace(/.*details\//, '');

        super.init();
        this.bookTitle = 'Loading';
        this.slug = getSlugFromTitle(bookTitle.toLowerCase());
        this.userStatusPromise = this.getUserStatusPromise();
        this.reverseGradient = false;
        this.titleImage = null;
        this.setCanonicalLink(`/details/${this.slug}`);
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

    insertJsonLd() {
        const el = document.createElement('script');
        const data = this.pageData;
        const authorData = data.authors.map((obj) => ({
            '@type': 'Person',
            'name': obj.name,
            'affiliation': obj.university
        }));
        const polish = $.isPolish(data.title);
        const ldData = {
            '@content': 'https://schema.org',
            '@type': 'WebPage',
            'datePublished': data.created,
            'dateModified': data.updated,
            'mainEntity': {
                'type': 'Book',
                'name': data.title,
                'author': authorData,
                'publisher': {
                    'type': 'Organization',
                    'name': 'OpenStax'
                },
                'image': data.cover_url,
                'inLanguage': polish ? 'Polish' : 'English',
                'isbn': data.digital_isbn_13,
                'url': data.webview_link
            }
        };
        const descriptionEl = document.querySelector('head meta[name="description"]');

        if (descriptionEl) {
            el.type = 'application/ld+json';
            el.textContent = JSON.stringify(ldData, null, 2);
            descriptionEl.parentNode.insertBefore(el, descriptionEl.nextSibling);
        }
    }

    onDataLoaded() {
        if (this.pageData.meta.type !== 'books.Book') {
            window.location.assign('/_404');
            return;
        }
        this.hideLoader();
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
        const addTab = (label, tabContents) => {
            contents[label] = tabContents;
            tabLabels.push(label);
        };
        const allies = shuffle(this.pageData.book_allies);

        if (!polish && this.pageData.free_stuff_instructor.content) {
            addTab('Instructor resources', new InstructorResourceTab(
                {
                    resources: this.pageData.book_faculty_resources,
                    allies,
                    userStatusPromise: this.userStatusPromise,
                    freeStuff: {
                        heading: this.pageData.free_stuff_instructor.content.heading,
                        blurb: this.pageData.free_stuff_instructor.content.content,
                        loggedInBlurb: this.pageData.free_stuff_instructor.content.content_logged_in
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
            ));
        }

        if (!polish && this.pageData.book_allies.length) {
            addTab('Partners', new PartnersTab({
                allies,
                ally: {
                    heading: this.pageData.ally_content.content.heading,
                    blurb: this.pageData.ally_content.content.content
                }
            }));
        }

        if (!polish && this.pageData.free_stuff_student.content) {
            addTab('Student resources', new StudentResourceTab({
                freeStuff: {
                    heading: this.pageData.free_stuff_student.content.heading,
                    blurb: this.pageData.free_stuff_student.content.content
                },
                resources: this.pageData.book_student_resources,
                userStatusPromise: this.userStatusPromise
            }));
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
            polish,
            bookInfo: this.pageData,
            bookTitle: this.bookTitle,
            bookState: this.pageData.book_state,
            detailsTabData: detailsTabData(),
            errataContent: this.pageData.errata_content,
            instructorResources: {
                freeResources: this.pageData.book_faculty_resources,
                paidResources: allies
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
        this.insertJsonLd();
    }

    onDataError() {
        window.location = '/_404';
    }

}
