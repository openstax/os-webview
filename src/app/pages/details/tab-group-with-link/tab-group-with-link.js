import TabGroup from '~/components/tab-group/tab-group';
import './tab-group-with-link.css';

export default class extends TabGroup {

    onLoaded() {
        super.onLoaded();
        const link = this.getProps().link;

        if (link) {
            this.regions.tabs.append(link);
        }
    }

};
