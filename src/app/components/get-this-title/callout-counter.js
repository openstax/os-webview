let slug = null;
let incremented;
const resetDate = new Date('2020/01/15');

export default {
    setSlug(newSlug) {
        if (newSlug !== slug) {
            slug = newSlug;
            incremented = false;
            if (slug && Date.now() > resetDate && this.lastReset < resetDate) {
                this.count = 0;
                this.lastReset = Date.now();
            }
        }
    },
    get resetIndex() {
        return `callout-reset-${slug}`;
    },
    get lastReset() {
        const savedValue = Number(localStorage.getItem(this.resetIndex)) ||
            Number(resetDate) - 100;

        return new Date(savedValue);
    },
    set lastReset(now) {
        localStorage.setItem(this.resetIndex, Number(now).toString());
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
