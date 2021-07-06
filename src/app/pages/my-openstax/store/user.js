import sfApiFetch from './sfapi';
import $ from '~/helpers/$';

export async function fetchUser() {
    const user = await sfApiFetch('users');

    if (!user.contact && (user.lead||[]).length === 0) {
        user.error = 'no lead or contact';
    }
    return $.camelCaseKeys(user);
}

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
