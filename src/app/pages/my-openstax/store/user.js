import sfApiFetch from './sfapi';
import $ from '~/helpers/$';

export default function (store) {
    const INITIAL_STATE = {
        user: {
            contact: {},
            opportunity: [],
            lead: [{}],
            schools: [],
            subscriptions: []
        }
    };

    store.on('@init', () => {
        store.dispatch('user/fetch');
        return INITIAL_STATE;
    });

    store.on('user/fetch', async () => {
        const user = await sfApiFetch('users');

        if (!user.contact) {
            user.contact = {};
        }
        store.dispatch('user/update', $.camelCaseKeys(user));
    });
    store.on('user/update', (_, user) => ({user: {..._.user, ...user}}));
}
