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
            classes: ['team', 'page'],
            tag: 'main'
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
            heroHeadline: this.pageData.header,
            heroParagraph: this.pageData.subheader,
            heroImage: this.pageData.header_image_url,
            headline: this.pageData.team_header
        } : null;
    }

    onDataLoaded() {
        this.update();
        const data = this.pageData;
        const tabLabels = data.openstax_people.map((t) => t.heading);
        const tabContents = data.openstax_people.map((t) => new PeopleTab(() => t.people));
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
        const accordionItems = data.openstax_people.map((t) => (
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
