import React from 'react';
import sfApiFetch from './sfapi';
import useFlagContext from '~/components/shell/flag-context';
import $ from '~/helpers/$';

export async function fetchUser() {
    const user = await sfApiFetch('users');

    if (user && !user.contact) {
        user.error = 'no contact';
    }
    return $.camelCaseKeys(user);
}

export function useMyOpenStaxIsAvailable() {
    const [user, setUser] = React.useState({error: 'not loaded'});
    const isEnabled = useFlagContext();

    React.useEffect(() => {
        if (isEnabled) {
            fetchUser().then(setUser);
        }
    }, [isEnabled]);

    return isEnabled && !user.error;
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
