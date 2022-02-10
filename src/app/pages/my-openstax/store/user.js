import React from 'react';
import sfApiFetch from './sfapi';
import useUserContext from '~/contexts/user';
import useFlagContext, {flagPromise} from '~/components/shell/flag-context';
import $ from '~/helpers/$';

async function fetchUser() {
    const user = await sfApiFetch('users');

    return $.camelCaseKeys(user || {});
}

export function useMyOpenStaxUser() {
    const [user, setUser] = React.useState({error: 'not loaded'});
    const {userModel} = useUserContext();
    const isVerified = userModel?.accountsModel?.faculty_status === 'confirmed_faculty';
    const {my_openstax: isEnabled} = useFlagContext();

    React.useEffect(() => {
        if (isEnabled) {
            fetchUser().then(setUser);
        }
    }, [isEnabled]);

    return isVerified ? user : {error: 'Not faculty verified'};
}

export function useMyOpenStaxIsAvailable() {
    const user = useMyOpenStaxUser();

    return !user.error;
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
        // can't use hooks
        flagPromise.then(({my_openstax: enabled}) => {
            if (enabled) {
                store.dispatch('user/fetch');
            }
        });
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
