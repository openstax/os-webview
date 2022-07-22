import React from 'react';
import useMyOpenStaxContext from './context';
import useUserContext from '~/contexts/user';
import sfApiFetch from '~/models/sfapi';

// Possible statuses are 'created', 'pending_create', 'pending_destroy'
export default function useSubscriptions() {
    const {lists} = useMyOpenStaxContext();
    const {myOpenStaxUser: {subscriptions}, updateMyOpenStaxUser} = useUserContext();
    const data = React.useMemo(
        () => lists.map((list) => ({
            ...list,
            subscribed: subscriptions.some((s) => s.listId === list.id && s.status !== 'pending_destroy')
        })),
        [lists, subscriptions]
    );

    // console.info({lists, subscriptions});
    return {
        lists: data,
        add(item) {
            sfApiFetch(`lists/${item.pardotId}/subscribe/`)
                .then(updateMyOpenStaxUser);
        },
        remove(item) {
            sfApiFetch(`lists/${item.pardotId}/unsubscribe/`)
                .then(updateMyOpenStaxUser);
        }
    };
}
