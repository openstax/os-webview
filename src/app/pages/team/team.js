import AccordionGroup from '~/components/accordion-group/accordion-group';
import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import ContentGroup from '~/components/content-group/content-group';
import PeopleTab from './people-tab/people-tab';
import TabGroup from '~/components/tab-group/tab-group';
import $ from '~/helpers/$';
import {description as template} from './team.html';
import css from './team.css';

const spec = {
    template,
    css,
    view: {
        classes: ['team', 'page'],
        tag: 'main'
    },
    slug: 'pages/team',
    regions: {
        accordion: 'accordion-region',
        tabGroup: 'people-tabs',
        tabContent: 'tab-content'
    },
    model() {
        return this.pageData ? {
            heroHeadline: this.pageData.header,
            heroParagraph: this.pageData.subheader,
            heroImage: this.pageData.header_image_url,
            headline: this.pageData.team_header
        } : null;
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class Team extends BaseClass {

    onDataLoaded() {
        $.setPageTitleAndDescriptionFromBookData(this.pageData);
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
        this.regions.accordion.attach(new AccordionGroup({
            items: accordionItems
        }));
    }

}
