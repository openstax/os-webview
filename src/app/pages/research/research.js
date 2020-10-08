import AccordionGroup from '~/components/accordion-group/accordion-group';
import componentType, {canonicalLinkMixin, insertHtmlMixin} from '~/helpers/controller/init-mixin';
import ContentGroup from '~/components/content-group/content-group';
import TabGroup from '~/components/tab-group/tab-group';
import AlumniTab from './alumni-tab/alumni-tab';
import MembersTab from './members-tab/members-tab';
import $ from '~/helpers/$';
import {description as template} from './research.html';
import css from './research.css';

const spec = {
    template,
    css,
    view: {
        classes: ['research', 'page'],
        tag: 'main'
    },
    regions: {
        accordion: 'accordion-region',
        tabGroup: 'people-tabs',
        tabContent: 'tab-content'
    },
    slug: 'pages/research',
    model() {
        const data = this.pageData;
        const projectColors = ['blue', 'green', 'yellow', 'red', 'orange'];

        return data && {
            missionHeader: data.mission_header,
            missionBody: data.mission_body,
            projectsHeader: data.projects_header,
            projects: data.projects
                .map((p, i) => ({
                    borderColor: projectColors[i%5],
                    title: p.title,
                    body: p.blurb,
                    url: p.link
                })),
            peopleHeader: data.people_header,
            publicationsHeader: data.publication_header,
            publications: data.publications
                .map((p) => ({
                    authors: p.authors,
                    date: new Date(p.date).getYear() + 1900,
                    title: p.title,
                    excerpt: p.excerpt,
                    downloadLink: p.download_url
                }))
        };
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin, insertHtmlMixin);

export default class Research extends BaseClass {

    onDataLoaded() {
        $.setPageTitleAndDescriptionFromBookData(this.pageData);
        Object.assign(this.pageData, this.mockPageData);
        this.update();
        const tabLabels = ['Alumni', 'Current members', 'External collaborators'];
        let selectedTab = tabLabels[1];
        const contents = {
            'Alumni': new AlumniTab(this.pageData.alumni),
            'Current members': new MembersTab(() => this.pageData.current_members),
            'External collaborators': new AlumniTab(this.pageData.external_collaborators)
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
                // setDetailsTabClass();
                contentGroup.update();
                // window.history.replaceState({}, selectedTab, `?${selectedTab}`);
            }
        }));
        const accordionItems = [
            {
                title: 'Alumni',
                contentComponent: new AlumniTab(this.pageData.alumni)
            },
            {
                title: 'Current members',
                contentComponent: new MembersTab(() => this.pageData.current_members)
            },
            {
                title: 'External collaborators',
                contentComponent: new AlumniTab(this.pageData.external_collaborators)
            }
        ];

        this.regions.tabGroup.attach(tabGroup);
        this.regions.tabContent.attach(contentGroup);
        this.regions.accordion.attach(new AccordionGroup({
            items: accordionItems
        }));
    }

}
