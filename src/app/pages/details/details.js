import Backbone from 'backbone';
import LoadingView from '~/helpers/backbone/loading-view';
import $ from '~/helpers/$';
import settings from 'settings';
import router from '~/router';
import PageModel from '~/models/pagemodel';
import Author from './author/author';
import Resource from './resource/resource';
import Contents from './contents/contents';
import Partner from './partner/partner';
import userModel from '~/models/usermodel';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './details.hbs';
import Remover from '~/components/remover/remover';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import {template as strips} from '~/components/strips/strips.hbs';

function dataToTemplateHelper(data) {
    let quotes = data.book_quotes[0] || {},
        result = {
            title: data.title,
            description: data.description,
            endorsement: quotes.quote_text,
            attribution: quotes.quote_author,
            attributionSchool: quotes.quote_author_school,
            topAuthors: data.book_contributing_authors.filter((entry) => entry.display_at_top),
            allAuthors: data.book_contributing_authors
        };

    result.coverUrl = data.cover_url ||
    `https://placeholdit.imgix.net/~text?txtsize=33&txt=${data.title}&w=220&h=220`;

    return result;
}

@props({
    template: template,
    css: '/app/pages/details/details.css',
    regions: {
        getThisTitle: '.floating-menu .get-this-book',
        seniorTopAuthors: '[data-id="senior-top-authors"]',
        topAuthors: '[data-id="top-authors"]',
        seniorAllAuthors: '[data-id="senior-all-authors"]',
        allAuthors: '[data-id="nonsenior-all-authors"]',
        instructorResources: '#instructor-resources',
        studentResources: '#student-resources',
        tableOfContents: '.table-of-contents .box ol',
        tocRemover: '.toc-remover',
        partners: '#partners'
    }
})
export default class Details extends LoadingView {
    @on('click a[href^="#"]')
    hashClick(e) {
        $.hashClick(e);
    }

    @on('click .table-of-contents-link')
    showTableOfContents(event) {
        this.openedWith = event.target;
        this.el.querySelector('.table-of-contents').classList.toggle('hidden');
        document.body.classList.add('toc-overlay');
        event.preventDefault();
        event.stopPropagation();
    }

    @on('click')
    hideTOC(event) {
        if (event.target !== this.openedWith) {
            this.el.querySelector('.table-of-contents').classList.add('hidden');
            document.body.classList.remove('toc-overlay');
        }
    }

    static metaDescription = () => `This book is a peer-reviewed, free,
    open textbook that covers standard scope and sequence. Access the text, authors,
    and resources here.`;

    constructor() {
        super(...arguments);
        this.templateHelpers = {strips};
    }

    toggleFixedClass() {
        let floatingMenu = document.querySelector('.floating-menu>.box');

        let body = document.body,
            html = document.documentElement;

        let height = Math.max(body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight);

        if (floatingMenu) {
            let footer = document.getElementById('footer');
            let footerHeight = Math.max(footer.scrollHeight, footer.offsetHeight);
            let floatingMenuHeight = Math.max(floatingMenu.scrollHeight, floatingMenu.offsetHeight)+210;
            let menuOffset = height - footerHeight - floatingMenuHeight;

            if ((window.pageYOffset > menuOffset) && (window.innerWidth > 768)) {
                floatingMenu.parentNode.classList.add('bottom');
            } else {
                floatingMenu.parentNode.classList.remove('bottom');
            }
        }
    }

    asEl(elOrString) {
        let value = elOrString;

        if (typeof elOrString === 'string') {
            value = this.el.querySelector(elOrString);
        }
        return value;
    }
    removeEl(elOrString) {
        let el = this.asEl(elOrString);

        el.parentNode.removeChild(el);
    }

    removeParentEl(elOrString) {
        let el = this.asEl(elOrString);

        el.parentNode.parentNode.removeChild(el.parentNode);
    }

    onRender() {
        $.applyScrollFix(this);
        this.toggleFixedClass();
        this.attachListenerTo(window, 'scroll', this.toggleFixedClass.bind(this));

        let slug = window.location.pathname.replace(/.*\//, ''),
            pageModel = new PageModel(),
            insertResources = (resources, regionName, alternateLink) => {
                if (resources.length) {
                    for (let res of resources) {
                        if (res.link_document_url || res.link_external) {
                            this.regions[regionName].append(new Resource(res, alternateLink));
                        }
                    }
                } else {
                    this.removeParentEl(this.regions[regionName].el);
                }
            },
            showInstructorResources = (resources) => {
                userModel.fetch().then((userData) => {
                    let userInfo = userData[0],
                        alternateLink = null,
                        encodedLocation = encodeURIComponent(Backbone.history.location.href),
                        extraInstructions = this.el.querySelector('#extra-instructions'),
                        isInstructor = true,
                        setLockState = () => {
                            for (let res of resources) {
                                res.showLock = isInstructor ? 'fa-unlock-alt' : 'fa-lock';
                            }
                        },
                        goToHref = (e) => {
                            e.preventDefault();
                            window.location = e.target.href;
                        };

                    if (!userInfo || userInfo.username === '') {
                        isInstructor = false;
                        alternateLink = `${settings.apiOrigin}/accounts/login/openstax/?next=${encodedLocation}`;
                        extraInstructions.innerHTML = `<a href="${alternateLink}">Login</a> for instructor access.`;
                        let anchor = extraInstructions.querySelector('a');

                        this.attachListenerTo(anchor, 'click', goToHref);
                    } else if (userInfo.groups.indexOf('Faculty') < 0) {
                        isInstructor = false;
                        alternateLink = '/faculty-verification';
                        extraInstructions.innerHTML = `<a href="${alternateLink}">Apply for instructor access.</a>`;
                    }

                    setLockState();
                    insertResources(resources, 'instructorResources', alternateLink);
                });
            },
            handbookLink = this.el.querySelector('.handbook-link'),
            setHandbookLink = (linkUrl) => {
                if (linkUrl) {
                    handbookLink.href = linkUrl;
                    handbookLink.parentNode.classList.remove('hidden');
                }
            },
            numberTableOfContents = (parent, continueFromChapter) => {
                let chapter = continueFromChapter || 0,
                    isUnitLevel = false,
                    endOfUnitChapter = 0,
                    handleUnit = (node) => {
                        if (isUnitLevel || (chapter === 1 && node.title.match(/^Unit/))) {
                            isUnitLevel = true;
                            delete node.chapter;
                        }
                    },
                    recurse = (node) => {
                        if (node.contents) {
                            numberTableOfContents(node, endOfUnitChapter);
                            if (isUnitLevel) {
                                endOfUnitChapter = node.contents.slice(-1)[0].chapter;
                            }
                        }
                    },
                    notAChapter = (node) =>
                        node.title.match(/^Preface/) || (!parent.chapter && !node.contents);

                for (let node of parent.contents) {
                    if (notAChapter(node)) {
                        continue;
                    }
                    ++chapter;
                    node.chapter = parent.chapter ? `${parent.chapter}.${chapter}` : chapter;
                    handleUnit(node);
                    recurse(node);
                }
            },
            showTableOfContents = (toc) => {
                if (toc) {
                    for (let entry of toc.contents) {
                        this.regions.tableOfContents.appendAs('li', new Contents(entry));
                    }
                }
            },
            handleErrataLink = (link, suggestionLink) => {
                let tab = this.el.querySelector('.errata-tab'),
                    section = this.el.querySelector('#errata'),
                    suggestionAnchor = section.querySelector('.suggest-correction-link'),
                    suggestionListItem = suggestionAnchor.parentNode;

                if (link) {
                    section.querySelector('.errata-link').href = link;
                    if (suggestionLink) {
                        suggestionAnchor.href = suggestionLink;
                    } else {
                        suggestionListItem.parentNode.removeChild(suggestionListItem);
                    }
                } else {
                    tab.parentNode.removeChild(tab);
                    section.parentNode.removeChild(section);
                }
            },
            handlePublishInfo = (data) => {
                document.getElementById('publish-date').textContent = data.publish_date;
                document.getElementById('isbn-10').textContent = data.isbn_10;
                document.getElementById('isbn-13').textContent = data.isbn_13;
                if (!data.license_name) {
                    return;
                }
                this.el.querySelector('.publish-info .license .text').textContent = `
                ${data.license_name} v${data.license_version}
                `;
                if (data.license_name.match(/share/i)) {
                    this.el.querySelector('.license img').src = '/images/details/by-sa-license.png';
                }
                if (data.license_text) {
                    this.el.querySelector('.license .extra-text').innerHTML = data.license_text;
                }
            },
            handleBasicBookData = (data) => {
                if (data.pages.length === 0) {
                    router.navigate('404', true);
                }

                let detailUrl = data.pages[0].meta.detail_url,
                    detailModel = new PageModel(),
                    handleToc = (toc) => {
                        if (toc) {
                            numberTableOfContents(toc);
                            showTableOfContents(toc);
                        } else {
                            this.removeEl('.table-of-contents-link');
                        }
                    },
                    handleEndorsement = (thData) => {
                        if (thData.endorsement) {
                            document.getElementById('endorsement').innerHTML = thData.endorsement;
                            document.getElementById('attribution').textContent = thData.attribution;
                            document.getElementById('attribution-school').textContent = thData.attributionSchool;
                        } else {
                            this.removeEl('section.endorsement');
                        }
                    },
                    handleComingSoon = (comingSoon) => {
                        if (comingSoon) {
                            for (let node of Array.from(this.el.querySelectorAll('.hide-if-coming-soon'))) {
                                node.classList.add('hidden');
                            }
                            this.el.querySelector('.cover-wrap').classList.add('coming-soon');
                        }
                    },
                    handleDetailData = (detailData) => {
                        let th = dataToTemplateHelper(detailData),
                            showAuthors = (authors, region, container) => {
                                for (let author of authors) {
                                    region.append(new Author(author));
                                }
                                if (authors.length === 0) {
                                    container.classList.add('hidden');
                                }
                            },
                            separateSeniors = (authors, options) => {
                                let seniors = authors.filter((d) => d.senior_author),
                                    nonseniors = authors.filter((d) => !d.senior_author);

                                showAuthors(seniors, options.seniorRegion, options.seniorContainer);
                                showAuthors(nonseniors, options.nonseniorRegion, options.nonseniorContainer);
                            };

                        separateSeniors(th.topAuthors, {
                            seniorRegion: this.regions.seniorTopAuthors,
                            seniorContainer: document.getElementById('senior-top-authors'),
                            nonseniorRegion: this.regions.topAuthors,
                            nonseniorContainer: document.getElementById('top-authors')
                        });

                        separateSeniors(th.allAuthors, {
                            seniorRegion: this.regions.seniorAllAuthors,
                            seniorContainer: document.getElementById('senior-all-authors'),
                            nonseniorRegion: this.regions.allAuthors,
                            nonseniorContainer: document.getElementById('nonsenior-all-authors')
                        });

                        this.el.querySelector('.book-cover').src = th.coverUrl;
                        this.el.querySelector('.book-info .title').innerHTML = th.title;
                        this.el.querySelector('.book-info .blurb').innerHTML = th.description;
                        handleEndorsement(th);
                        this.gtt = new GetThisTitle(detailData);
                        this.regions.getThisTitle.show(this.gtt);
                        setHandbookLink(detailData.student_handbook_url);
                        handleToc(detailData.table_of_contents);
                        showInstructorResources(detailData.book_faculty_resources);
                        insertResources(detailData.book_student_resources, 'studentResources');
                        handleErrataLink(detailData.errata_link, detailData.errata_corrections_link);
                        handlePublishInfo(detailData);
                        handleComingSoon(detailData.webview_link === '');

                        if (detailData.book_allies.length) {
                            for (let partner of detailData.book_allies) {
                                let partnerTemplateHelper = {
                                    name: partner.ally_heading,
                                    blurb: partner.ally_short_description,
                                    url: partner.book_link_url,
                                    linkText: partner.book_link_text,
                                    logoUrl: partner.ally_color_logo
                                };

                                this.regions.partners.append(new Partner(partnerTemplateHelper));
                            }
                        } else {
                            let el = this.regions.partners.el;

                            if (typeof el === 'string') {
                                el = this.el.querySelector(el);
                            }
                            el.parentNode.parentNode.removeChild(el.parentNode);
                        }
                    };

                detailModel.fetch({url: detailUrl}).then(handleDetailData.bind(this));
                this.regions.tocRemover.append(new Remover(() => {})); // just for show
            };

        pageModel.fetch({
            data: {type: 'books.Book', slug}
        }).then(handleBasicBookData.bind(this));
        super.onRender();
    }

    onLoaded() {
        super.onLoaded();
        this.el.querySelector('.details-page').classList.remove('hidden');
    }
}
