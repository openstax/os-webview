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

        this.itemComponents = this.items.map((item) => {
            const itemComponent = new AccordionItem({
                props: {
                    label: item.title,
                    openLabel: item.openTitle || item.title,
                    contentComponent: item.contentComponent,
                    get selectedLabel() {
                        return selectedLabel;
                    }
                }
            });

            itemComponent.on('change', (isOpen) => {
                selectedLabel = isOpen ? null : item.title;
                this.updateItems();
            });

            return itemComponent;
        });

        this.itemComponents.forEach((i) => {
            this.regions.self.append(i);
        });
    }

    updateItems() {
        this.itemComponents.forEach((i) => {
            i.emit('update');
        });
    }

}
