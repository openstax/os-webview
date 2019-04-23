export default class ManagedComponent {

    constructor(component, id, parent) {
        this.component = component;
        this.id = id;
        this.parent = parent;
    }

    findRegion() {
        const el = this.parent.el.querySelector(`plug-in[data-id=${this.id}]`);
        const Region = this.parent.regions.self.constructor;

        return el ? new Region(el, this.parent) : null;
    }

    attach() {
        this.region = this.findRegion();
        if (this.region) {
            this.region.attach(this.component);
        }
    }

    detach() {
        if (this.region) {
            this.region.detach(this.component);
            this.region = null;
        }
    }

    update() {
        if (this.region) {
            this.component.update();
        }
    }

}
