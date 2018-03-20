import VERSION from '~/version';
import {Controller} from 'superb.js';
import Tab from './tab/tab';
import {description as template} from './tab-group.html';

export default class TabGroup extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['tab-heading']
        };
        this.regions = {
            tabs: '.tab-group'
        };
        this.css = `/app/components/tab-group/tab-group.css?${VERSION}`;
    }

    // Never updates, so just set up the children
    // Future work: handle updated tab list
    onLoaded() {
        const props = this.getProps();
        const handlers = {
            setSelected: (newValue) => {
                props.setSelected(newValue);
                this.updateTabs();
            }
        };

        this.tabs = props.tabLabels.map((label) => {
            const getProps = () => (
                {
                    label,
                    selectedLabel: this.getProps().selectedTab
                }
            );

            return new Tab(props.tag, getProps, handlers);
        });

        for (const tab of this.tabs) {
            this.regions.tabs.append(tab);
        }
    }

    updateTabs() {
        for (const tab of this.tabs) {
            tab.update();
        }
    }

}
