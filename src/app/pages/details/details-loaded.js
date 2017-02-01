import settings from 'settings';
import {Controller} from 'superb';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import router from '~/router';
import {sfUserModel} from '~/models/usermodel';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import Resource from './resource/resource';
import Contents from './contents/contents';
import Partner from './partner/partner';
import {description as template} from './details-loaded.html';

export default class DetailsLoaded extends Controller {

    init(model) {
        this.template = template;
        this.css = '/app/pages/details/details.css';
        this.view = {
            classes: ['details-page']
        };
        this.regions = {
            getThisTitle: '.floating-menu .get-this-book',
            instructorResources: '#instructor-resources',
            studentResources: '#student-resources',
            tableOfContents: 'table-of-contents',
            partners: '#partners'
        };
        this.model = model;
        this.model.bottom = '';
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
        this.regions.getThisTitle.append(new GetThisTitle(this.model));
        sfUserModel.load().then((user) => {
            let alternateLink = null;
            let isInstructor = true;
            const encodedLocation = encodeURIComponent(window.location.href);
            const setLockState = () => {
                for (const res of this.model.book_faculty_resources) {
                    res.showLock = isInstructor ? 'fa-unlock-alt' : 'fa-lock';
                }
            };
            const insertResources = (resources, regionName) => {
                for (const res of resources) {
                    if (res.link_document_url || res.link_external) {
                        this.regions[regionName].append(new Resource(res, alternateLink));
                    }
                }
            };
            const insertPartners = () => {
                for (const partner of this.model.book_allies) {
                    const partnerTemplateHelper = {
                        name: partner.ally_heading,
                        blurb: partner.ally_short_description,
                        url: partner.book_link_url,
                        linkText: partner.book_link_text,
                        logoUrl: partner.ally_color_logo
                    };

                    this.regions.partners.append(new Partner(partnerTemplateHelper));
                }
            };
            const insertToc = () => {
                if (this.model.table_of_contents) {
                    const tocController = new Contents(this.model.table_of_contents, {tag: 'ol'});

                    this.regions.tableOfContents.attach(tocController);
                }
            };
            const handlePending = () => {
                if (user.pending_verification) {
                    alternateLink = '#';
                    this.model.extraInstructions = 'Your request to access these resources is pending.';
                } else {
                    alternateLink = `${settings.accountHref}/faculty_access/apply?r=${encodedLocation}`;
                    this.model.extraInstructions =
                        `<a href="${alternateLink}" data-local="true">Apply for instructor access.</a>`;
                }
            };

            if (!user || user.username === '') {
                isInstructor = false;
                alternateLink = sfUserModel.loginLink();
                this.model.extraInstructions =
                    `<a href="${alternateLink}" data-local="true">Login</a> for instructor access.`;
            } else if (!('groups' in user) || !user.groups.includes('Faculty')) {
                isInstructor = false;
                handlePending();
            }
            $.insertHtml(this.el, this.model);

            setLockState();
            insertResources(this.model.book_faculty_resources, 'instructorResources');
            alternateLink = null;
            insertResources(this.model.book_student_resources, 'studentResources');
            insertToc();
            insertPartners();
        });

        this.toggleFixedClass();
        this.boundToggleFixedClass = this.toggleFixedClass.bind(this);
        window.addEventListener('scroll', this.boundToggleFixedClass);
        window.addEventListener('resize', this.boundToggleFixedClass);
    }

    onClose() {
        window.removeEventListener('scroll', this.boundToggleFixedClass);
        window.removeEventListener('resize', this.boundToggleFixedClass);
    }

    @on('click a[href^="#"]')
    hashClick(e) {
        $.hashClick(e);
    }

    @on('click .table-of-contents-link')
    showTableOfContents(event) {
        this.openedWith = event.target;
        event.preventDefault();
        event.stopPropagation();
        this.model.tocIsOpen = true;
        this.update();
        document.body.style.overflow = 'hidden';
    }

    @on('click')
    hideTOC(event) {
        if (event.target !== this.openedWith) {
            this.model.tocIsOpen = false;
            this.update();
            document.body.style.overflow = '';
        }
    }

    toggleFixedClass() {
        const floatingMenu = document.querySelector('.floating-menu>.box');
        const body = document.body;
        const html = document.documentElement;
        const height = Math.max(body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight);

        if (floatingMenu) {
            const footer = document.getElementById('footer');
            const footerHeight = Math.max(footer.scrollHeight, footer.offsetHeight);
            const floatingMenuHeight = Math.max(floatingMenu.scrollHeight, floatingMenu.offsetHeight)+210;
            const menuOffset = height - footerHeight - floatingMenuHeight;

            if ((window.pageYOffset > menuOffset) && (window.innerWidth > 768)) {
                this.model.bottom = 'bottom';
            } else {
                this.model.bottom = '';
            }
            this.update();
        }
    }

/*
    onLoaded() {
        $.applyScrollFix(this);
        const slug = window.location.pathname.replace(/.*\//, '');
  }
  */

}
