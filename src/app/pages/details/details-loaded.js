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
                    res.showLock = res.resource_unlocked || isInstructor ? 'fa-unlock-alt' : 'fa-lock';
                }
            };
            const insertResources = (resources, regionName) => {
                for (const res of resources) {
                    const altLink = res.resource_unlocked ? null : alternateLink;

                    this.regions[regionName].append(new Resource(res, altLink));
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
            const hasGroups = 'groups' in user;
            const hideResourcesFromStudent = () => {
                if (hasGroups && user.groups.includes('Student')) {
                    /* eslint camelcase: 0 */
                    this.model.book_faculty_resources = [];
                }
            };
            const checkForNonInstructor = () => {
                if (!user || !user.username) {
                    isInstructor = false;
                    alternateLink = sfUserModel.loginLink();
                    this.model.extraInstructions =
                        `For locked resources, <a href="${alternateLink}" data-local="true">log in
                        or create an instructor account</a>.`;
                } else if (!hasGroups || !user.groups.includes('Faculty')) {
                    isInstructor = false;
                    hideResourcesFromStudent();
                    handlePending();
                }
            };

            checkForNonInstructor();
            $.insertHtml(this.el, this.model);

            setLockState();
            this.model.hideInstructorInstructions = isInstructor || user.pending_verification;
            insertResources(this.model.book_faculty_resources, 'instructorResources');
            alternateLink = null;
            insertResources(this.model.book_student_resources, 'studentResources');
            insertToc();
            insertPartners();
            this.update();
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

    @on('keydown .table-of-contents-link')
    operateByKey(event) {
        if ([$.key.space, $.key.enter].includes(event.keyCode)) {
            event.preventDefault();
            this.showTableOfContents(event);
        }
    }

    @on('click')
    hideTOC(event) {
        if (event.target !== this.openedWith) {
            this.model.tocIsOpen = false;
            this.update();
            document.body.style.overflow = '';
        }
    }

    @on('keydown')
    handleKeysInTOC(event) {
        if (this.model.tocIsOpen) {
            const remover = this.el.querySelector('.toc-remover');

            if ([$.key.enter, $.key.esc].includes(event.keyCode)) {
                this.model.tocIsOpen = false;
                this.update();
            } else if (![$.key.space, $.key.up, $.key.down].includes(event.keyCode)) {
                remover.focus();
                event.preventDefault();
            }
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

}
