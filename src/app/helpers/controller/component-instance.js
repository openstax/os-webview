export default class ComponentInstance {

    constructor(component, selector) {
        this.component = component;
        this.selector = selector;
        this.region = null;
    }

    update() {
        if (this.region === null) {
            const Region = this.component.regions.self.Constructor;
            const el = this.component.parent.el.querySelector(this.selector);

            if (el) {
                this.region = new Region(el, this.component.parent);
                this.region.attach(this.component);
            }
        } else {
            this.component.update();
        }
    }

}
