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

    constructor(initialValue=null) {
        super();
        this._data = initialValue;
    }

    get value() {
        return this._data;
    }

    set value(newValue) {
        const action = newValue ? 'add' : 'delete';

        this._data = newValue;
        this._bus.emit('notify', {
            [action]: newValue
        });
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

    get size() {
        return this._data === null ? 0 : 1;
    }

}

export class SetStore extends Store {

    constructor() {
        super();
        this._data = new window.Set();
    }

    toggle(value) {
        const action = this._data.has(value) ? 'delete' : 'add';

        this._data[action](value);
        this._bus.emit('notify', {
            [action]: value
        });
    }

    clear() {
        this._data.clear();
        this._bus.emit('notify', {});
    }

    includes(value) {
        return this._data.has(value);
    }

    get value() {
        return Array.from(this._data);
    }

    get size() {
        return this._data.size;
    }

}
