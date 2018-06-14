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

        // State
    }

    getModel() {
        const data = this.pageData || {};
        const projectColors = ['blue', 'green', 'yellow', 'red', 'orange'];

        return {
            missionHeader: data.mission_header,
            missionBody: data.mission_body,
            projectsHeader: data.projects_header,
            projects: (data.projects || []).map((p, i) => ({
                borderColor: projectColors[i%5],
                title: p.title,
                body: p.body
            })),
            peopleHeader: data.people_header,
            publicationsHeader: data.publication_header,
            publications: (data.publications || [])
                .map((p) => ({
                    authors: p.authors,
                    date: new Date(p.date).getYear(),
                    title: p.title,
                    excerpt: p.excerpt,
                    downloadLink: p.download_url
                }))
        };
    }

    onLoaded() {
        /* eslint-disable */
        const lorem = `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas quis sodales nisl,
            eget tincidunt velit. Nulla eu tortor libero. Pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus
            et magnis dis parturient montes, nascetur ridiculus mus. Mauris libero nunc, interdum
            nec vestibulum eu, laoreet eget sapien. Mauris hendrerit sit amet sem non feugiat.`;
        const halfLorem = lorem.substr(0, lorem.length / 2);

        this.mockPageData = {
            alumni: [
                {
                    name: 'Roy Johnson',
                    description: 'JavaScript developer'
                },
                {
                    name: 'Michael Harrison',
                    description: 'Wagtail developer'
                }

            ],
            externals: [
                {
                    name: 'Ed Woodward',
                    description: 'BIT team lead'
                },
                {
                    name: 'Bruce Pike',
                    description: 'Project manager'
                }

            ],
            projects: ['blue', 'green', 'yellow', 'red', 'orange'].map((c) => ({
                title: `${c} Title`,
                body: halfLorem
            })),
        };
        /* eslint-enable */
    }

    onDataLoaded() {
        Object.assign(this.pageData, this.mockPageData);
        this.update();
        const tabLabels = ['Alumni', 'Current members', 'External collaboration'];
        let selectedTab = tabLabels[1];
        const contents = {
            'Alumni': new AlumniTab(this.pageData.alumni),
            'Current members': new MembersTab(() => this.pageData.people),
            'External collaboration': new AlumniTab(this.pageData.externals)
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
