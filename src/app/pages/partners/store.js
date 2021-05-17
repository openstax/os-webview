import {SetStore, ScalarStore} from '~/helpers/store';

export const books = new SetStore();
export const types = new ScalarStore();
export const advanced = new SetStore();
export const sort = new ScalarStore('-2');
export const resultCount = new ScalarStore('0');
export function clearStores() {
    [books, types, advanced].forEach((store) => store.clear());
}
