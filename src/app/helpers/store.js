import {Bus} from '~/helpers/controller/bus-mixin';

/*
* A store is shared this._data with a bus to notify subscribers when it is updated
*/

class Store {

    constructor() {
        this._bus = new Bus();
    }

    on(...args) {
        return this._bus.on(...args);
    }

}

export class ScalarStore extends Store {

    constructor(initialValue) {
        super();
        this._data = initialValue;
    }

    get value() {
        return this._data;
    }

    set value(newValue) {
        this._data = newValue;
        this._bus.emit('notify');
    }

    includes(value) {
        return this._data === value;
    }

    toggle(value) {
        this.value = this._data === value ? null : value;
    }

    clear() {
        this.value = null;
    }

}

export class SetStore extends Store {

    constructor() {
        super();
        this._data = new Set();
    }

    toggle(value) {
        if (this._data.has(value)) {
            this._data.delete(value);
        } else {
            this._data.add(value);
        }
        this._bus.emit('notify');
    }

    clear() {
        this._data.clear();
        this._bus.emit('notify');
    }

    includes(value) {
        return this._data.has(value);
    }

    get value() {
        return Array.from(this._data);
    }

}
