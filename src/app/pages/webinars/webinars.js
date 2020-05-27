import componentType from '~/helpers/controller/init-mixin';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './webinars.html';
import css from './webinars.css';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group';
import WebinarList from './webinar-list/webinar-list';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import cmsFetch from '~/models/cmsFetch';
import orderBy from 'lodash/orderBy';

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
            headline: this.pageData.heading,
            description: this.pageData.description,
            heroImage: this.pageData.hero_image.meta.download_url
        };
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
    }

    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        this.update();
        cmsFetch('webinars/?format=json').then((data) => this.attachChildren(data));
    }

    attachChildren(webinarList) {
        const tabLabels = ['Upcoming webinars', 'Past webinar recordings'];
        let selectedTab = decodeURIComponent(window.location.search.replace('?', '')) || tabLabels[0];
        const contents = {};
        const addTab = (label, tabContents) => {
            contents[label] = tabContents;
        };
        const toModel = (webinarInfo) => {
            const start = new Date(webinarInfo.start);
            const weekday = start.toLocaleString('en-us', {weekday: 'long'});
            const startHour = start.toLocaleString('en-us', {hour: 'numeric', minute: 'numeric'});
            const endHour = new Date(webinarInfo.end)
                .toLocaleString('en-us', {hour: 'numeric', minute: 'numeric', timeZoneName: 'short'});

            return {
                dayOfMonth: start.getDate(),
                month: start.toLocaleString('en-us', {month: 'short'}),
                dayAndTime: `${weekday}, ${startHour} - ${endHour}`,
                title: webinarInfo.title,
                description: webinarInfo.description,
                speakers: webinarInfo.speakers,
                spacesRemaining: webinarInfo.spaces_remaining,
                url: webinarInfo.registration_url,
                linkText: webinarInfo.registration_link_text
            };
        };
        const byDate = (a, b) => {
            const da = new Date(a.start);
            const db = new Date(b.start);

            return da - db;
        };
        const upcomingModel = webinarList
            .filter((entry) => new Date(entry.start) > Date.now())
            .sort(byDate)
            .map(toModel);
        const pastModel = webinarList
            .filter((entry) => new Date(entry.end) < Date.now())
            .sort(byDate)
            .map(toModel);

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
