import Backbone from 'backbone';
import BaseView from '~/helpers/backbone/view';
import $ from '~/helpers/$';
import PageModel from '~/models/pagemodel';
import Author from './author/author';
import Resource from './resource/resource';
import Contents from './contents/contents';
import Ally from './ally/ally';
import userModel from '~/models/usermodel';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './details.hbs';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import {template as strips} from '~/components/strips/strips.hbs';
import settings from 'settings';

function dataToTemplateHelper(data) {
    let quotes = data.book_quotes[0],
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
        tableOfContents: '.table-of-contents .box',
        allies: '#allies'
    }
})
export default class Details extends BaseView {
    @on('click a[href^="#"]')
    hashClick(e) {
        let target = e.target;

        while (!target.href) {
            target = target.parentNode;
        }
        let hash = new URL(target.href).hash,
            targetEl = document.getElementById(hash.substr(1));

        $.scrollTo(targetEl);
        e.preventDefault();
    }

    @on('click .table-of-contents-link')
    showTableOfContents(event) {
        this.openedWith = event.target;
        this.el.querySelector('.table-of-contents').classList.toggle('hidden');
        document.body.setAttribute('style', 'overflow:hidden');
        event.preventDefault();
        event.stopPropagation();
    }

    @on('click')
    hideTOC(event) {
        if (event.target !== this.openedWith) {
            this.el.querySelector('.table-of-contents').classList.add('hidden');
            document.body.removeAttribute('style');
        }
    }

    @on('touchstart .table-of-contents')
    startScrollBio(e) {
        let element = this.el.querySelector('.table-of-contents');

        this.scrollInfo = {
            element,
            touchStartY: e.targetTouches[0].pageY,
            elementStartY: element.scrollTop
        };
    }

    @on('touchmove .table-of-contents')
    scrollBio(e) {
        let info = this.scrollInfo,
            newY = e.targetTouches[0].pageY,
            diff = info.touchStartY - newY;

        info.element.scrollTop = info.elementStartY + diff;
        e.preventDefault();
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
        this.toggleFixedClass();

        window.addEventListener('scroll', this.toggleFixedClass.bind(this));

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
            showTableOfContents = (toc) => {
                if (toc) {
                    for (let entry of toc.contents) {
                        this.regions.tableOfContents.append(new Contents(entry));
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
                this.el.querySelector('.publish-info .license .text').textContent = `
                ${data.license_name} v${data.license_version}
                `;
                if (data.license_name.match(/share/i)) {
                    this.el.querySelector('.license img').src = '/images/details/by-sa-license.png';
                }
            },
            handleBasicBookData = (data) => {
                if (data.pages.length === 0) {
                    window.location.href = '404';
                }

                let detailUrl = data.pages[0].meta.detail_url,
                    detailModel = new PageModel(),

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
                        document.getElementById('endorsement').innerHTML = th.endorsement;
                        document.getElementById('attribution').textContent = th.attribution;
                        document.getElementById('attribution-school').textContent = th.attributionSchool;
                        this.gtt = new GetThisTitle(detailData);
                        this.regions.getThisTitle.show(this.gtt);
                        setHandbookLink(detailData.student_handbook_url);
                        showTableOfContents(detailData.table_of_contents);
                        showInstructorResources(detailData.book_faculty_resources);
                        insertResources(detailData.book_student_resources, 'studentResources');
                        handleErrataLink(detailData.errata_link, detailData.errata_corrections_link);
                        handlePublishInfo(detailData);

                        for (let ally of detailData.book_allies) {
                            let allyTemplateHelper = {
                                name: ally.ally_heading,
                                blurb: ally.ally_short_description,
                                url: ally.book_link_url,
                                linkText: ally.book_link_text,
                                logoUrl: ally.ally_logo
                            };

                            this.regions.allies.append(new Ally(allyTemplateHelper));
                        }
                    };

                detailModel.fetch({url: detailUrl}).then(handleDetailData.bind(this));
            };

        pageModel.fetch({
            data: {type: 'books.Book', slug}
        }).then(handleBasicBookData.bind(this));
    }

    onBeforeClose() {
        window.removeEventListener('scroll', this.toggleFixedClass.bind(this));
    }
}
