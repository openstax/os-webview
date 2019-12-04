import {SetStore, ScalarStore} from '~/helpers/store';

export const books = new SetStore();
export const costs = new SetStore();
export const types = new SetStore();
export const advanced = new SetStore();
export const displayMode = new ScalarStore('grid');

export default {
    books,
    costs,
    types,
    advanced,
    displayMode
};
