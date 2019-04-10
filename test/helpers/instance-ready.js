export default function (BaseClass) {
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
        }

        onDataLoaded() {
            super.onDataLoaded();
            dataResolver();
        }
    }

    return {
        instance: new TestClass(),
        ready
    }
}
