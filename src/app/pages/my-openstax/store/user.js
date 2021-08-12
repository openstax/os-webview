import sfApiFetch from './sfapi';
import $ from '~/helpers/$';

export async function fetchUser() {
    const user = await sfApiFetch('users');

    if (!(user && user.contact)) {
        user.error = 'no contact';
    }
    return $.camelCaseKeys(user);
}

export default function (store) {
    const INITIAL_STATE = {
        user: {
            contact: {},
            opportunity: [],
            schools: [],
            subscriptions: []
        }
    };

    store.on('@init', () => {
        store.dispatch('user/fetch');
        return INITIAL_STATE;
    });

    store.on('user/fetch', async () =>
        store.dispatch('user/update', await fetchUser())
    );
    store.on('user/update', (_, user) => {
        if (!user.subscriptions) {
            user.subscriptions = [];
        }
        return {user: {..._.user, ...user}};
    });
}
