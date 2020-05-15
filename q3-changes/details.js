import $ from '~/helpers/$';
import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import ContentGroup from '~/components/content-group/content-group';
import DetailsTab from './details-tab/details-tab';
import getCompCopyDialogProps from './comp-copy-dialog-props';
import InstructorResourceTab from './instructor-resource-tab/instructor-resource-tab';
import PhoneView from './phone-view/phone-view';
import StudentResourceTab from './student-resource-tab/student-resource-tab';
import VideosTab from './videos-tab/videos-tab';
import TabGroup from '~/components/tab-group/tab-group';
import userModel from '~/models/usermodel';
import fetchRexRelease from '~/models/rex-release';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import analytics from '~/helpers/analytics';
import {description as template} from './details.html';
import css from './details.css';
import {on} from '~/helpers/controller/decorators';

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
        classes: ['details-page'],
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
            titleLogo: this.isTutor ? '/images/details/blue-tutor-logo.svg' : '',
            reverseGradient: this.reverseGradient,
            tocActive: this.tocActive
        };
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin);

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
                'url': data.rex_webview_link || data.webview_link
            }
        };
        const descriptionEl = document.querySelector('head meta[name="description"]');

        if (descriptionEl) {
            el.type = 'application/ld+json';
            el.textContent = JSON.stringify(ldData, null, 2);
            descriptionEl.parentNode.insertBefore(el, descriptionEl.nextSibling);
        }
    }

    fixSlideoutToViewport() {
        const el = this.el.querySelector('.toc-slideout');

        if (!this.tocActive) {
            return;
        }
        const wh = window.innerHeight;
        const {top: normalTop, bottom: normalBottom} = el.parentNode.getBoundingClientRect();
        const headerClearance = 10; // fudge factor
        const headerBottom = document.querySelector('#header')
            .getBoundingClientRect().bottom + headerClearance;
        const newTop = normalTop > headerBottom ? 0 : headerBottom - normalTop;
        const newHeight = Math.min(wh, normalBottom) - Math.max(normalTop, headerBottom);

        if (newTop > 0) {
            el.style.top = `${newTop}px`;
        } else {
            el.style.removeProperty('top');
        }

        el.style.height = `${newHeight}px`;
    }

    onAttached() {
        if (super.onAttached) {
            super.onAttached();
        }
        this.boundFixSlideout = this.fixSlideoutToViewport.bind(this);
        window.addEventListener('scroll', this.boundFixSlideout);
        window.addEventListener('resize', this.boundFixSlideout);
    }

    onClose() {
        if (super.onClose) {
            super.onClose();
        }
        window.removeEventListener('scroll', this.boundFixSlideout);
        window.removeEventListener('resize', this.boundFixSlideout);
    }

    onDataLoaded() {
        analytics.addResourcesToLookupTable(this.pageData);
        if (this.pageData.meta.type !== 'books.Book') {
            throw new Error(`Pagedata for ${this.slug} is not of type books.Book: ${this.pageData.meta.type}`);
        }
        const isTutor = this.pageData.webview_rex_link.includes('tutor');
        const isRex = !isTutor && Boolean(this.pageData.webview_rex_link);
        const webviewLink = this.pageData.webview_rex_link || this.pageData.webview_link;
        const polish = $.isPolish(this.pageData.title);
        const fetchUpdateDate = isRex ?
            fetchRexRelease(this.pageData.webview_rex_link, this.pageData.cnx_id)
                .then((r) => r.revised) :
            Promise.resolve(this.pageData.last_updated_web);
        const fetchDetailsTabData = fetchUpdateDate
            .then((webUpdateDate) => () => {
                /* eslint complexity: 0 */
                const model = {
                    bookInfo: this.pageData,
                    bookState: this.pageData.book_state,
                    description: this.pageData.description,
                    errataBlurb: this.pageData.errata_content.content && this.pageData.errata_content.content.content,
                    formattedPublishDate: this.pageData.publish_date && formatDate(this.pageData.publish_date),
                    formattedWebUpdateDate: webUpdateDate && formatDate(webUpdateDate),
                    formattedPDFUpdateDate: this.pageData.last_updated_pdf &&
                        formatDate(this.pageData.last_updated_pdf),
                    isRex,
                    isTutor,
                    polish,
                    salesforceAbbreviation: this.pageData.salesforce_abbreviation,
                    slug: this.slug,
                    title: this.pageData.title,
                    webviewLink
                };
                const authors = this.pageData.authors;
                const senior = (author) => author.senior_author;
                const nonsenior = (author) => !author.senior_author;

                model.allSenior = authors.filter(senior);
                model.allNonsenior = authors.filter(nonsenior);
                Reflect.ownKeys(this.pageData)
                    .filter((key) => key.match(/isbn|license/))
                    .forEach((key) => {
                        model[key] = this.pageData[key];
                    });
                if (model.license_name) {
                    model.licenseIcon = model.license_name.match(/share/i) ?
                        '/images/details/by-nc-sa.svg' : '/images/details/by.svg';
                }

                return model;
            });
        const tabLabels = [polish ? 'Szczegóły książki' : 'Book details'];
        let selectedTab = decodeURIComponent(window.location.search.replace('?', '')) || tabLabels[0];
        const compCopyDialogProps = getCompCopyDialogProps(
            {
                title: this.pageData.title,
                coverUrl: this.pageData.cover_url,
                prompt: (this.pageData.comp_copy_content || ['Request your complimentary iBooks download'])[0]
            },
            this.userStatusPromise
        );

        fetchDetailsTabData.then((detailsTabData) => {
            const detailsTab = new DetailsTab(detailsTabData());
            const contents = polish ?
                {
                    'Szczegóły książki': detailsTab
                } :
                {
                    'Book details': detailsTab
                };
            const addTab = (label, tabContents) => {
                contents[label] = tabContents;
                tabLabels.push(label);
            };
            const featuredResources = this.pageData.book_faculty_resources.filter((r) => r.featured);
            const otherResources = this.pageData.book_faculty_resources.filter((r) => !r.featured);
            const errataResource = this.pageData.book_faculty_resources
                .find((r) => r.resource_heading === 'Errata Release Notes');

            if (errataResource) {
                detailsTab.emit('errata-resource', errataResource.link_document_url);
            }
            this.detailsTab = detailsTab;
            detailsTab.on('toc', (whether) => this.setTocOpen(whether));
            detailsTab.emit('put-toc-in', this.regionFrom(this.el.querySelector('.toc-slideout-contents')));
            if (!polish && this.pageData.free_stuff_instructor.content) {
                addTab('Instructor resources', new InstructorResourceTab({
                    bookAbbreviation: this.pageData.salesforce_abbreviation,
                    userStatusPromise: this.userStatusPromise,
                    featuredResourcesHeader: this.pageData.featured_resources_header,
                    model: {
                        featuredResources,
                        otherResources,
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
                        }
                    },
                    dialogProps: compCopyDialogProps,
                    partnerListLabel: this.pageData.partner_list_label || '[partner_list_label]',
                    seeMoreText: this.pageData.partner_page_link_text || '[partner_page_link_text]'
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

            if (this.pageData.videos.length) {
                addTab('Videos', new VideosTab({
                    model: {
                        videos: this.pageData.videos[0]
                    }
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
            this.isTutor = isTutor;
            this.update();

            this.regions.phoneView.attach(new PhoneView({
                polish,
                bookInfo: this.pageData,
                bookTitle: this.bookTitle,
                bookState: this.pageData.book_state,
                detailsTabData: detailsTabData(),
                errataContent: this.pageData.errata_content,
                includeTOC: ['live', 'new_edition_available'].includes(this.pageData.book_state),
                featuredResourcesHeader: this.pageData.featured_resources_header,
                featuredResources,
                isRex,
                isTutor,
                otherResources,
                slug: this.slug,
                salesforceAbbreviation: this.pageData.salesforce_abbreviation,
                studentResources: this.pageData.book_student_resources,
                userStatusPromise: this.userStatusPromise,
                webviewLink,
                compCopyDialogProps
            }));
            this.regions.tabController.attach(tabGroup);
            this.regions.tabContent.attach(contentGroup);
            this.insertJsonLd();
        });
    }

    onDataError(e) {
        throw new Error(`Data error: ${e}`);
    }

    setTocOpen(whether) {
        this.tocActive = whether;
        if (whether) {
            $.scrollTo(this.el.querySelector('.content-wrapper'));
        } else {
            const el = this.el.querySelector('.toc-slideout');

            el.removeAttribute('style');
        }
        this.update();
    }

    @on('click .close-toc')
    closeToc() {
        if (this.detailsTab) {
            this.detailsTab.emit('set-toc', false);
        }
    }

    @on('keypress .close-toc')
    handleKeypress(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            this.closeToc();
        }
    }

}