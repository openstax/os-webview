/*
* This is a communication channel intended to mediate messaging between
* parent and child components. In general, props go from parent to child
* and events go from child to parent. Events *may* go from parent to child,
* but child should *never* modify a prop.
*/

const HANDLERS = Symbol();
const BUS = Symbol();

class Bus {

    constructor(props) {
        this[HANDLERS] = {};
        this.props = {};
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
        handlers[event].push(handler);
    }

    emit(event, payload) {
        const handlers = this[HANDLERS];

        if (event in handlers) {
            handlers[event].forEach((wrappedHandler) => {
                wrappedHandler.handler(payload);
            });
            handlers[event] = handlers[event].filter((w) => !w.once);
        }
    }

    set(name, value) {
        const oldValue = this.props[name];

        if (value !== oldValue) {
            this.props[name] = value;
            this.emit('prop-changed-from', {name: oldValue});
        }
    }

    get(name) {
        return this.props[name];
    }

}

/* The bus is created by the parent component and passed to the child.
*  Props are promoted to object-level getters.
*  Object-level emit and on methods are created.
*/
const childMixin = (superclass) => class extends superclass {

    init(...args) {
        this[BUS] = delete args[bus];
        Reflect.ownKeys(this[BUS].props, (k) => {
            Object.defineProperty(this, k, {
                enumerable: true,
                get() { return this[BUS].props[k]; }
            });
        });
        super.init(...args);
    }

    on(...args) {
        this[BUS].on(...args);
    }

    emit(...args) {
        this[BUS].emit(...args);
    }

}
