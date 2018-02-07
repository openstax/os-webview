import VERSION from '~/version';
import {Controller} from 'superb.js';
import Tab from './tab/tab';
import {on} from '~/helpers/controller/decorators';
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
        let props = this.getProps();
        const tabs = props.tabLabels.map((label) => {
            const updateTabs = () => {
                props = this.getProps();
                for (const tab of tabs) {
                    tab.update();
                }
            };

            return new Tab(() => ({
                tag: props.tag,
                label,
                selectedLabel: props.selectedTab,
                setSelected: (newValue) => {
                    props.setSelected(newValue);
                    updateTabs();
                }
            }));
        });

        for (const tab of tabs) {
            this.regions.tabs.append(tab);
        }
    }

}
