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
import './details.css!';

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
    regions: {
        getThisTitle: '.floating-menu .get-this-book',
        topAuthors: '#top-authors',
        allAuthors: '#all-authors',
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
        $.scrollTo($.hashTarget(e));
        e.preventDefault();
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

    onRender() {
        $.applyScrollFix(this);
        this.toggleFixedClass();
        this.attachListenerTo(window, 'scroll', this.toggleFixedClass.bind(this));

        let slug = decodeURIComponent(window.location.search.substr(1)),
            pageModel = new PageModel(),
            insertResources = (resources, regionName, alternateLink) => {
                for (let res of resources) {
                    if (res.link_document_url) {
                        this.regions[regionName].append(new Resource(res, alternateLink));
                    }
                }
            };

        if (slug === '') {
            slug = window.location.pathname.replace(/.*\//, '');
        }

        let showInstructorResources = (resources) => {
                userModel.fetch().then((userData) => {
                    let userInfo = userData[0],
                        alternateLink = null,
                        encodedLocation = encodeURIComponent(Backbone.history.location.href),
                        extraInstructions = this.el.querySelector('#extra-instructions');

                    if (!userInfo || userInfo.username === '') {
                        alternateLink = `${settings.apiOrigin}/accounts/login/openstax/?next=${encodedLocation}`;
                        extraInstructions.innerHTML = `<a href="${alternateLink}">Login</a> for instructor access.`;
                        let anchor = extraInstructions.querySelector('a'),
                            goToHref = (e) => {
                                e.preventDefault();
                                window.location = e.target.href;
                            };

                        this.attachListenerTo(anchor, 'click', goToHref);
                    } else if (userInfo.groups.indexOf('Faculty') < 0) {
                        alternateLink = '/faculty-verification';
                        extraInstructions.innerHTML = `<a href="${alternateLink}">Apply for instructor access.</a>`;
                    }
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
                            this.el.querySelector('.table-of-contents-link').remove();
                        }
                    },
                    handleEndorsement = (thData) => {
                        if (thData.endorsement) {
                            document.getElementById('endorsement').innerHTML = thData.endorsement;
                            document.getElementById('attribution').textContent = thData.attribution;
                            document.getElementById('attribution-school').textContent = thData.attributionSchool;
                        } else {
                            this.el.querySelector('.endorsement').remove();
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
                        let th = dataToTemplateHelper(detailData);

                        for (let topAuthor of th.topAuthors) {
                            this.regions.topAuthors.append(new Author(topAuthor));
                        }
                        for (let author of th.allAuthors) {
                            this.regions.allAuthors.append(new Author(author));
                        }
                        this.el.querySelector('.book-cover').src = th.coverUrl;
                        this.el.querySelector('.book-info .title').textContent = th.title;
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
