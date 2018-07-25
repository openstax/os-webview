import VERSION from '~/version';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import CMSPageController from '~/controllers/cms';
import ContentGroup from '~/components/content-group/content-group';
import PeopleTab from './people-tab/people-tab';
import TabGroup from '~/components/tab-group/tab-group';
import {description as template} from './team.html';

export default class Team extends CMSPageController {

    init() {
        this.template = template;
        this.view = {
            classes: ['team', 'page']
        };
        this.css = `/app/pages/team/team.css?${VERSION}`;
        this.slug = 'pages/team';
        this.regions = {
            accordion: 'accordion-region',
            tabGroup: 'people-tabs',
            tabContent: 'tab-content'
        };
        this.model = () => this.getModel();
    }

    getModel() {
        return this.pageData ? {
            heroHeadline: this.pageData.hero_headline,
            heroParagraph: this.pageData.hero_paragraph,
            heroImage: this.pageData.hero_image,
            headline: this.pageData.headline
        } : {};
    }

    onLoaded() {
        this.pageData = {
            hero_headline: 'Changing our world is a team effort',
            hero_paragraph: 'Meet the people behind OpenStax',
            hero_image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/images/richard.original.original.jpg',
            headline: 'Our Team',
            tabs: [
                {
                    heading: 'OpenStax Leadership',
                    people: [
                        {
                            name: 'Richard G. Baraniuk',
                            title: 'Founder and Director',
                            image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Richard.png'
                        }
                    ]
                },
                {
                    heading: 'OpenStax Team',
                    people: [
                        {
                            name: 'Micaela McGlone',
                            title: 'Research Specialist',
                            image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Micaela.png',
                            description: `
                                As a research specialist on the OpenStax team, Micaela's primary
                                responsibilities include coordinating the pilots of OpenStax Tutor
                                courseware and preparing proposals and documentation for institutional
                                review boards. She is a native of San Antonio, Texas (read: an avid Spurs
                                fan) and a graduate of Washington and Lee University."
                            `
                        },
                        {
                            name: 'Michael Mulich',
                            title: 'Consultant'
                            // no image
                        },
                        {
                            name: 'Dani Nicholson',
                            title: 'Associate Director, Marketing and Communications',
                            image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Dani.png',
                            description: `
                                Dani is a graduate of West Texas A&M University and the University of North Texas.
                                Before joining OpenStax, she worked in communication and marketing at University
                                of North Texas, in Creative Solutions at CNBC Europe, and reported for local
                                newspapers. Dani oversees the communication components to all higher
                                education-related activities for OpenStax.
                            `
                        },
                        {
                            name: 'Micaela McGlone',
                            title: 'Research Specialist',
                            image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Micaela.png',
                            description: `
                                As a research specialist on the OpenStax team, Micaela's primary
                                responsibilities include coordinating the pilots of OpenStax Tutor
                                courseware and preparing proposals and documentation for institutional
                                review boards. She is a native of San Antonio, Texas (read: an avid Spurs
                                fan) and a graduate of Washington and Lee University."
                            `
                        },
                        {
                            name: 'Michael Mulich',
                            title: 'Consultant'
                            // no image
                        },
                        {
                            name: 'Dani Nicholson',
                            title: 'Associate Director, Marketing and Communications',
                            image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Dani.png',
                            description: `
                                Dani is a graduate of West Texas A&M University and the University of North Texas.
                                Before joining OpenStax, she worked in communication and marketing at University
                                of North Texas, in Creative Solutions at CNBC Europe, and reported for local
                                newspapers. Dani oversees the communication components to all higher
                                education-related activities for OpenStax.
                            `
                        }
                    ]
                },
                {
                    heading: 'Faculty Advisory Board',
                    people: [
                        {
                            name: 'Richard G. Baraniuk',
                            title: 'Founder and Director',
                            image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Richard.png'
                        }
                    ]
                },
                {
                    heading: 'Strategic Advisors',
                    people: [
                        {
                            name: 'Richard G. Baraniuk',
                            title: 'Founder and Director',
                            description: 'It\'s beginning to look a lot like Christmas everywhere you go.'
                        }
                    ]
                }
            ]
        };
        this.onDataLoaded();
    }

    onDataLoaded() {
        this.update();
        const data = this.pageData;
        const tabLabels = data.tabs.map((t) => t.heading);
        const tabContents = data.tabs.map((t) => new PeopleTab(() => t.people));
        let selectedTab = tabLabels[0];
        const contents = {};

        tabLabels.forEach((v, i) => {
            contents[v] = tabContents[i];
        });

        const contentGroup = new ContentGroup(() => ({
            selectedTab,
            contents
        }));
        const tabGroup = new TabGroup(() => ({
            tag: 'h3',
            tabLabels,
            selectedTab,
            setSelected(newValue) {
                selectedTab = newValue;
                contentGroup.update();
            }
        }));
        const accordionItems = data.tabs.map((t) => (
            {
                title: t.heading,
                contentComponent: new PeopleTab(() => t.people)
            }
        ));

        this.regions.tabGroup.attach(tabGroup);
        this.regions.tabContent.attach(contentGroup);
        this.regions.accordion.attach(new AccordionGroup(() => ({
            items: accordionItems
        })));
    }

}
