import {Controller} from 'superb.js';
import AccordionItem from './item/item';

export default class AccordionGroup extends Controller {

    init(getProps) {
        this.getProps = getProps;
        this.view = {
            classes: ['accordion-group']
        };
        this.css = '/app/components/accordion-group/accordion-group.css';
    }

    template() {
    }

    // Never updates, so just set up the children
    // Future work: handle updated item list
    onLoaded() {
        let props = this.getProps();
        let selectedLabel;
        const items = props.items.map((item) => {
            const updateItems = () => {
                props = this.getProps();
                for (const i of items) {
                    i.update();
                }
            };

            return new AccordionItem(() => ({
                tag: props.tag,
                label: item.title,
                contentComponent: item.contentComponent,
                selectedLabel,
                setSelected: (newValue) => {
                    selectedLabel = newValue;
                    updateItems();
                }
            }));
        });

        for (const item of items) {
            this.regions.self.append(item);
        }
    }

}
