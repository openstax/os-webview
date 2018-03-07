export default class ComponentArray {

    constructor(getArray, constructComponent, region) {
        this.getArray = getArray;
        this.constructComponent = constructComponent;
        this.region = region;
        this.existing = new Map();
        for (const item of getArray()) {
            const component = constructComponent(item);

            this.existing.set(item, component);
            this.region.attach(component);
        }
    }

    update() {
        const newMap = new Map();
        const array = this.getArray();

        for (const item of array) {
            newMap.set(item, null);
        }

        // For already-created components, if they exist in the new array,
        // unparent them and assign them to the new map;
        // otherwise, detach them
        this.existing.forEach((component, item) => {
            if (newMap.has(item)) {
                if (component.el) {
                    component.el.parentNode.removeChild(component.el);
                }
                newMap.set(item, component);
            } else {
                component.detach();
            }
        });

        // Now insert them all in order
        for (const item of array) {
            let component = newMap.get(item);

            if (component === null) {
                component = this.constructComponent(item);
                newMap.set(item, component);
            }
            this.region.append(component);
            component.update();
        }
        this.existing = newMap;
    }

}
