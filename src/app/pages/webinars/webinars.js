import componentType from '~/helpers/controller/init-mixin';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './webinars.html';
import css from './webinars.css';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group';
import WebinarList from './webinar-list/webinar-list';
import AccordionGroup from '~/components/accordion-group/accordion-group';

const spec = {
    template,
    css,
    view: {
        classes: ['webinars', 'page'],
        tag: 'main' // if the HTML doesn't contain a main tag
    },
    slug: 'pages/webinars',
    regions: {
        phoneView: '.phone-view',
        tabController: '.tab-controller',
        tabContent: '.tab-content'
    },
    model() {
        if (!this.pageData) {
            return {};
        }
        return {
            headline: this.pageData.headline,
            description: this.pageData.description,
            heroImage: this.pageData.heroImage
        };
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.pageData = {
            headline: 'Webinar Lorem Ipsum',
            description: `Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Phasellus ultricies orci in hendrerit suscipit. Ut massa felis,
            tincidunt nec arcu vel, dapibus pulvinar lectus.`,
            heroImage: 'https://via.placeholder.com/800x290'
        };
        setTimeout(() => {
            this.onDataLoaded();
        }, 600);
    }

    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        this.update();
        this.attachChildren();
    }

    attachChildren() {
        const tabLabels = ['Upcoming webinars', 'Past webinar recordings'];
        let selectedTab = decodeURIComponent(window.location.search.replace('?', '')) || tabLabels[0];
        const contents = {};
        const addTab = (label, tabContents) => {
            contents[label] = tabContents;
        };
        const sampleData = {
            dayOfMonth: '10',
            month: 'Jan',
            title: 'Pair your OpenStax text with affordable skullduggery and shoes.',
            dayAndTime: 'Wednesday, 2 - 3 p.m. CTD',
            description: `
            A webinar on making textbooks inclusive: Join the conversation
            now and then continue it at Creator Fest. On campuses everywhere
            conversations and courses of action around diversity, equity, and
            inclusion are improving education.`,
            speakers: 'Anthony Palmiotto, Symphonie Swift',
            spacesRemaining: '25',
            url: 'https://www.google.com',
            linkText: 'Register for this webinar'
        };
        const upcomingModel = [
            sampleData,
            sampleData,
            sampleData,
            sampleData,
            sampleData
        ];
        const pastModel = upcomingModel.map((obj) =>
            Object.assign({}, obj, {
                linkText: 'Watch this webinar'
            })
        );

        upcomingModel.upcoming = true;
        [upcomingModel, pastModel].forEach((model, index) => {
            addTab(tabLabels[index], new WebinarList({model}));
        });

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
                contentGroup.update();
                window.history.replaceState({}, selectedTab, `?${selectedTab}`);
            }
        }));

        this.regions.tabController.attach(tabGroup);
        this.regions.tabContent.attach(contentGroup);

        const accordionItems = [upcomingModel, pastModel]
            .map((model, index) => ({
                title: tabLabels[index],
                contentComponent: new WebinarList({model})
            }));

        this.regions.phoneView.attach(new AccordionGroup({
            items: accordionItems
        }));
    }

}
