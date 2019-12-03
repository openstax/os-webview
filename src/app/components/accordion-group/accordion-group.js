import componentType from '~/helpers/controller/init-mixin';
import AccordionItem from './item/item';
import css from './accordion-group.css';
import busMixin from '~/helpers/controller/bus-mixin';

const spec = {
    view: {
        classes: ['accordion-group']
    },
    css
};

export default class AccordionGroup extends componentType(spec, busMixin) {

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
                },
                noScroll: this.noScroll
            });

            itemComponent.on('change', (isOpen) => {
                selectedLabel = isOpen ? null : item.title;
                this.updateItems();
                this.emit('open', selectedLabel);
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
