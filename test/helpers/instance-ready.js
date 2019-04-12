export default function (BaseClass, ...args) {
    let dataResolver, pageResolver;
    const ready = Promise.all([
        new Promise((resolve) => {
            dataResolver = resolve;
        }),
        new Promise((resolve) => {
            pageResolver = resolve;
        })
    ]);

    class TestClass extends BaseClass {
        onLoaded() {
            super.onLoaded();
            pageResolver();
            if (!this.slug) {
                dataResolver();
            }
        }

        onDataLoaded() {
            super.onDataLoaded();
            dataResolver();
        }
    }

    return {
        instance: new TestClass(...args),
        ready
    }
}
