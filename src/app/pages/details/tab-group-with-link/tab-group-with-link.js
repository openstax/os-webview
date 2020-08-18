import TabGroup from '~/components/tab-group/tab-group';
import './tab-group-with-link.css';

export default class extends TabGroup {

    onLoaded() {
        super.onLoaded();
        this.regions.tabs.append(this.getProps().link);
    }

};
