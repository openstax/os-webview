import sfApiFetch from './sfapi';
import $ from '~/helpers/$';

export default function (store) {
    const INITIAL_STATE = {
        lists: []
    };

    store.on('@init', () => {
        store.dispatch('lists/fetch');
        return INITIAL_STATE;
    });

    store.on('lists/fetch', async () => {
        const all = await sfApiFetch('lists');

        if (all instanceof Array) {
            store.dispatch('lists/update', $.camelCaseKeys(all));
        }
    });
    store.on('lists/update', (_, all) => ({lists: all}));
}
