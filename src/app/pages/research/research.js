import VERSION from '~/version';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import CMSPageController from '~/controllers/cms';
import ContentGroup from '~/components/content-group/content-group';
import TabGroup from '~/components/tab-group/tab-group';
import $ from '~/helpers/$';
import AlumniTab from './alumni-tab/alumni-tab';
import MembersTab from './members-tab/members-tab';
import {description as template} from './research.html';

export default class Research extends CMSPageController {

    init() {
        this.template = template;
        this.view = {
            classes: ['research', 'page']
        };
        this.css = `/app/pages/research/research.css?${VERSION}`;
        this.slug = 'pages/research';
        this.model = () => this.getModel();
        this.regions = {
            accordion: 'accordion-region',
            tabGroup: 'people-tabs',
            tabContent: 'tab-content'
        };
    }

    getModel() {
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
                    body: p.blurb
                })),
            peopleHeader: data.people_header,
            publicationsHeader: data.publication_header,
            publications: data.publications
                .map((p) => ({
                    authors: p.authors,
                    date: new Date(p.date).getYear(),
                    title: p.title,
                    excerpt: p.excerpt,
                    downloadLink: p.download_url
                }))
        };
    }

    onDataLoaded() {
        Object.assign(this.pageData, this.mockPageData);
        this.update();
        const tabLabels = ['Alumni', 'Current members', 'External collaboration'];
        let selectedTab = tabLabels[1];
        const contents = {
            'Alumni': new AlumniTab(this.pageData.alumni),
            'Current members': new MembersTab(() => this.pageData.current_members),
            'External collaboration': new AlumniTab(this.pageData.external_collaborators)
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
                contentComponent: new AlumniTab(() => null)
            },
            {
                title: 'Current members',
                contentComponent: new MembersTab(() => this.pageData.people)
            },
            {
                title: 'External collaboration',
                contentComponent: new AlumniTab(() => null)
            }
        ];

        this.regions.tabGroup.attach(tabGroup);
        this.regions.tabContent.attach(contentGroup);
        this.regions.accordion.attach(new AccordionGroup(() => ({
            items: accordionItems
        })));
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

}
