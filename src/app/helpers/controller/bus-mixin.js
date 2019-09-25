/*
 * This is a communication channel intended to provide standard messaging between
 * parent and child components
 */

const HANDLERS = Symbol();
const BUS = Symbol();

export class Bus {

    /**
     * Provides two methods, one to emit events, and the other to perform actions
     * when an event is emitted.
     */

    constructor() {
        this[HANDLERS] = {};
    }

    on(event, handler, options) {
        const handlers = this[HANDLERS];
        const wrappedHandler = Object.assign(
            { handler },
            options
        );

        if (!(event in handlers)) {
            handlers[event] = [];
        }
        handlers[event].push(wrappedHandler);
        // Return a remover
        return () => {
            handlers[event] = handlers[event].filter((e) => e !== wrappedHandler);
        };
    }

    emit(event, ...payload) {
        const handlers = this[HANDLERS];

        if (event in handlers) {
            handlers[event].forEach((wrappedHandler) => {
                if (!wrappedHandler.inactive) {
                    wrappedHandler.handler(...payload);
                    if (wrappedHandler.once) {
                        wrappedHandler.inactive = true;
                    }
                }
            });
        }
    }

}

export default (superclass) => class extends superclass {

    /**
     * Adds bus methods to a class, along with a private internal bus implementation
     * Usually, a component will emit events and its parent will listen and
     * handle the event.
     * One notable exception: the parent may issue `update-props` events that the
     * child will handle in its `whenPropsUpdated` method.
     */

    constructor(...args) {
        super(...args);
        if (!this[BUS]) {
            this.init();
        }
    }

    init(...args) {
        if (super.init) {
            super.init(...args);
        }
        this[BUS] = new Bus();
        this.on('update-props', (obj) => {
            Object.assign(this, obj);
            if (this.whenPropsUpdated) {
                this.whenPropsUpdated(obj);
            }
        });
    }

    on(...args) {
        return this[BUS].on(...args);
    }

    emit(...args) {
        this[BUS].emit(...args);
    }

};
