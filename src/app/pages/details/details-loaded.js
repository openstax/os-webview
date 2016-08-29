import settings from 'settings';
import {Controller} from 'superb';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import router from '~/router';
import userModel from '~/models/usermodel';
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
            seniorAllAuthors: '[data-id="senior-all-authors"]',
            allAuthors: '[data-id="nonsenior-all-authors"]',
            instructorResources: '#instructor-resources',
            studentResources: '#student-resources',
            tableOfContents: 'table-of-contents',
            tocRemover: '.toc-remover',
            partners: '#partners'
        };
        this.model = model;
    }

    onLoaded() {
        for (const htmlEl of this.el.querySelectorAll('[data-html]')) {
            /* eslint no-eval: 0 */
            const expr = `this.model.${htmlEl.dataset.html}`;

            try {
                htmlEl.innerHTML = eval(expr);
            } catch (e) {
                console.warn('Eval', expr, e);
            }
        }
        this.regions.getThisTitle.append(new GetThisTitle(this.model));
        userModel.load().then((user) => {
            let alternateLink = null;
            let isInstructor = true;
            const encodedLocation = encodeURIComponent(window.location.href);
            const extraInstructions = this.el.querySelector('#extra-instructions');
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

            if (!user || user.username === '') {
                isInstructor = false;
                alternateLink = `${settings.apiOrigin}/accounts/login/openstax/?next=${encodedLocation}`;
                extraInstructions.innerHTML = `<a href="${alternateLink}">Login</a> for instructor access.`;
                const anchor = extraInstructions.querySelector('a');
            } else if (!('groups' in user) || !user.groups.includes('Faculty')) {
                isInstructor = false;
                alternateLink = '/faculty-verification';
                extraInstructions.innerHTML = `<a href="${alternateLink}">Apply for instructor access.</a>`;
            }

            setLockState();
            insertResources(this.model.book_faculty_resources, 'instructorResources');
            alternateLink = null;
            insertResources(this.model.book_student_resources, 'studentResources');

            const tocController = new Contents(this.model.table_of_contents, {tag: 'ol'});

            this.regions.tableOfContents.attach(tocController);
            insertPartners();
        });
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
    }

    @on('click')
    hideTOC(event) {
        if (event.target !== this.openedWith) {
            this.model.tocIsOpen = false;
            this.update();
        }
    }

    /*
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

            // FIX: Move DOM changes to template
            if ((window.pageYOffset > menuOffset) && (window.innerWidth > 768)) {
                floatingMenu.parentNode.classList.add('bottom');
            } else {
                floatingMenu.parentNode.classList.remove('bottom');
            }
        }
    }

    onLoaded() {
        $.applyScrollFix(this);
        this.toggleFixedClass();
        this.attachListenerTo(window, 'scroll', this.toggleFixedClass.bind(this));

        const slug = window.location.pathname.replace(/.*\//, '');
    */

}
