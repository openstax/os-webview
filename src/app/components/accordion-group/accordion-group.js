import componentType from '~/helpers/controller/init-mixin';
import AccordionItem from './item/item';
import css from './accordion-group.css';

const spec = {
    view: {
        classes: ['accordion-group']
    },
    css
};

export default class AccordionGroup extends componentType(spec) {

    // Never updates, so just set up the children
    onLoaded() {
        let selectedLabel;
        const handlers = {
            setSelected: (newValue) => {
                selectedLabel = newValue;
                this.updateItems();
            }
        };

        this.itemComponents = this.items.map((item) => {
            return new AccordionItem({
                getProps: () => ({
                    label: item.title,
                    openLabel: item.openTitle || item.title,
                    contentComponent: item.contentComponent,
                    selectedLabel
                }),
                handlers
            });
        });

        this.itemComponents.forEach((i) => {
            this.regions.self.append(i);
        });
    }

    updateItems() {
        this.itemComponents.forEach((i) => {
            i.update();
        });
    }

}
