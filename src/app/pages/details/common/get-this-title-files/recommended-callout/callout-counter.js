export class Implementation {

    constructor(resetDate) {
        this.resetDate = resetDate;
        this.slug = null;
        this.incremented = false;
    }

    setSlug(newSlug) {
        if (newSlug !== this.slug) {
            this.slug = newSlug;
            this.incremented = false;
            if (this.slug && Date.now() > this.resetDate && this.lastReset < this.resetDate) {
                this.count = 0;
                this.lastReset = Date.now();
            }
        }
    }

    get resetIndex() {
        return `callout-reset-${this.slug}`;
    }

    get lastReset() {
        const savedValue = Number(localStorage.getItem(this.resetIndex)) ||
            Number(this.resetDate) - 100;

        return new Date(savedValue);
    }

    set lastReset(now) {
        localStorage.setItem(this.resetIndex, Number(now).toString());
    }

    get index() {
        if (this.slug === null) {
            throw new Error('calloutCounter: no slug set');
        }
        return `callout-${this.slug}`;
    }

    get count() {
        return Number(localStorage.getItem(this.index));
    }

    set count(newValue) {
        localStorage.setItem(this.index, newValue);
    }

    increment() {
        if (!this.incremented) {
            this.count += 1;
            this.incremented = true;
        }
    }

}

export default new Implementation(new Date('2020/01/29'));
