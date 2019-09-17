let slug = null;
let incremented;

export default {
    setSlug(newSlug) {
        if (newSlug !== slug) {
            slug = newSlug;
            incremented = false;
        }
    },
    get index() {
        if (slug === null) {
            throw new Error('calloutCounter: no slug set');
        }
        return `callout-${slug}`;
    },
    get count() {
        return Number(localStorage.getItem(this.index));
    },
    set count(newValue) {
        localStorage.setItem(this.index, newValue);
    },
    increment() {
        if (!incremented) {
            this.count += 1;
            incremented = true;
        }
    }
};
