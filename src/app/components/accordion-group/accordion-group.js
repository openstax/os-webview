import VERSION from '~/version';
import {Controller} from 'superb.js';
import AccordionItem from './item/item';

export default class AccordionGroup extends Controller {

    init(getProps) {
        this.getProps = getProps;
        this.view = {
            classes: ['accordion-group']
        };
        this.css = `/app/components/accordion-group/accordion-group.css?${VERSION}`;

        this.items = [];
    }

    template() {
    }

    // Never updates, so just set up the children
    // Future work: use ComponentArray
    onLoaded() {
        let selectedLabel;
        const handlers = {
            setSelected: (newValue) => {
                selectedLabel = newValue;
                this.updateItems();
            }
        };
        const props = this.getProps();

        this.items = props.items.map((item) => {
            return new AccordionItem(
                props.tag,
                () => ({
                    label: item.title,
                    openLabel: item.openTitle || item.title,
                    contentComponent: item.contentComponent,
                    selectedLabel
                }),
                handlers
            );
        });

        for (const item of this.items) {
            this.regions.self.append(item);
        }
    }

    updateItems() {
        for (const item of this.items) {
            item.update();
        }
    }

}
