import {Bus} from '~/helpers/controller/bus-mixin';
const bus = new Bus();

bus.get = (message) => {
    let result;

    bus.on(`${message}-response`, (response) => {
        result = response;
    }, {once: true});
    bus.emit(message);
    return result;
};

const services = {};

bus.serve = (message, callback) => {
    if (services[message]) {
        services[message]();
    }
    services[message] = bus.on(message, () => {
        bus.emit(`${message}-response`, callback());
    });
};

export default bus;
