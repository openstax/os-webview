import {Bus} from '~/helpers/controller/bus-mixin';

export default function () {
    const bus = new Bus();
    const data = new Set();

    return {
        toggle(value) {
            if (data.has(value)) {
                data.delete(value);
            } else {
                data.add(value);
            }
            bus.emit('notify', data);
        },
        clear() {
            data.clear();
            bus.emit('notify', data);
        },
        includes(value) {
            return data.has(value);
        },
        get value() {
            return Array.from(data);
        },
        on(...args) {
            return bus.on(...args);
        }
    };
}
