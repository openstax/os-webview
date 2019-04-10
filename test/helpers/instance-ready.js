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

    let updateResolver;

    function waitForUpdate() {
        return new Promise((resolve) => {
            updateResolver = resolve;
        });
    }

    class TestClass extends BaseClass {
        onLoaded() {
            super.onLoaded();
            pageResolver();
        }

        onDataLoaded() {
            super.onDataLoaded();
            dataResolver();
        }

        onUpdate() {
            if (super.onUpdate) {
                super.onUpdate();
            }
            if (updateResolver) {
                updateResolver();
            }
        }
    }

    return {
        instance: new TestClass(),
        ready,
        waitForUpdate
    }
}
