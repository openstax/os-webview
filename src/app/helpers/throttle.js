class Ticker {

    constructor(fn) {
        this.ticking = false;
        this.fn = fn;
        this.update = () => {
            this.ticking = false;
            this.fn();
        };
    }

    tick() {
        if (!this.ticking) {
            requestAnimationFrame(this.update);
            this.ticking = true;
        }
    }

}

export default function (fn) {
    const ticker = new Ticker(fn);

    return () => ticker.tick();
}
