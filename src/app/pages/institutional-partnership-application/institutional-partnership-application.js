import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group';
import ProgramDetails from './program-details';
import Application from './application';
import {description as template} from './institutional-partnership-application.html';
import css from './institutional-partnership-application.css';

const spec = {
    template,
    css,
    view: {
        tag: 'main',
        classes: ['institutional-page', 'page']
    },
    model() {
        return this.pageData && {
            heading: this.pageData.heading,
            headingYear: this.pageData.heading_year,
            testimonial: this.testimonials[this.selectedTab]
        };
    },
    slug: 'pages/institutional-partnership'
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class Institutional extends BaseClass {

    init() {
        super.init();
        this.tabLabels = ['Program details', 'Application'];
        this.selectedTab = this.tabLabels[0];
        this.applicationTabContent = new Application();
    }

    onDataLoaded() {
        const data = this.pageData;
        const contents = {
            'Program details': new ProgramDetails({
                model: {
                    sections: data.program_tab_content[0]
                }
            }),
            'Application': this.applicationTabContent
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

        this.testimonials = {
            'Program details': {
                block: data.quote,
                name: data.quote_author,
                address1: data.quote_title,
                address2: data.quote_school
            },
            'Application': {
                block: data.application_quote,
                name: data.application_quote_author,
                address1: data.application_quote_title,
                address2: data.application_quote_school
            }
        };
        this.update();
        this.insertHtml();

        this.regionFrom('.tab-controller').attach(tabGroup);
        this.regionFrom('.tab-content').attach(contentGroup);
    }

}
