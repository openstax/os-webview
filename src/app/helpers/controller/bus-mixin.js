/*
* This is a communication channel intended to mediate messaging between
* parent and child components. This is the only argument the child can
* receive for its init. All configuration is done by responding to an event.
*
* In general, parent will emit 'new-props' events and 'update-props' events.
* Child will emit events created as necessary to alert the parent of anything.
*/

const HANDLERS = Symbol();
const BUS = Symbol();

export class Bus {

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

/* The bus is created by the child component.
*  Object-level emit and on methods are created.
*/
export default (superclass) => class extends superclass {

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
        });
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        if (this.whenPropsUpdated) {
            this.on('update-props', (obj) => {
                this.whenPropsUpdated(obj);
            });
        }
    }

    on(...args) {
        return this[BUS].on(...args);
    }

    emit(...args) {
        this[BUS].emit(...args);
    }

};
