import createSetStore from './set-store';

const books = createSetStore();
const costs = createSetStore();
const types = createSetStore();
const advanced = createSetStore();

export {
    books,
    costs,
    types,
    advanced
};
