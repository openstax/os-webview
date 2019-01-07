import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group';
import ProgramDetails from './program-details';
import Application from './application';
import {description as template} from './institutional-partnership.html';
import css from './institutional-partnership.css';

const spec = {
    template,
    css,
    view: {
        tag: 'main',
        classes: ['institutional-page', 'page']
    },
    regions: {
        tabController: '.tab-controller',
        tabContent: '.tab-content'
    },
    model() {
        return this.testimonials[this.selectedTab];
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class Institutional extends BaseClass {

    init() {
        super.init();
        this.tabLabels = ['Program details', 'Application'];
        this.selectedTab = this.tabLabels[0];
        this.testimonials = {
            'Program details': {
                block: 'Teaming up with the other OpenStax Institutional Partner' +
                ' schools provided a sense of community as we navigated launching' +
                ' OER initiatives at our own campuses. Learning about other schools’' +
                ' successes and frustrations each month was inspiring. I learned so' +
                ' many new techniques and innovative ideas that I could then apply at' +
                ' my own campus. I loved the structure of this program. It’s inspiring' +
                ' to see how many students are impacted by OER adoption – the numbers' +
                ' really add up quickly.',
                name: 'Erin Davis',
                address1: 'Distance Education Library Services Coordinator',
                address2: 'Utah State University'
            },
            'Application': {
                block: 'With guidance we received through the Institutional Partner' +
                ' program, we were able to strategically plan events and presentations' +
                ' to increase faculty awareness of Open Educational Resources, resulting' +
                ' in more than a dozen new OER adoptions.  We anticipate that number' +
                ' will significantly increase again as we enter the second year of the' +
                ' program.',
                name: 'Jennifer Kneafsey',
                address1: 'Associate Professor of Biology',
                address2: 'Tulsa Community College'
            }
        };
    }

    onLoaded() {
        const contents = {
            'Program details': new ProgramDetails(),
            'Application': new Application()
        };
        const contentGroup = new ContentGroup(() => ({
            selectedTab: this.selectedTab,
            contents
        }));
        const tabGroup = new TabGroup(() => ({
            tag: 'label',
            tabLabels: this.tabLabels,
            selectedTab: this.selectedTab,
            setSelected: (newValue) => {
                this.selectedTab = newValue;
                this.update();
                contentGroup.update();
            }
        }));

        this.regions.tabController.attach(tabGroup);
        this.regions.tabContent.attach(contentGroup);
    }

}
