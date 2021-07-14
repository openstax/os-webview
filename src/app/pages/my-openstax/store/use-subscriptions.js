// import {useState, useEffect} from 'react';
import { useStoreon } from 'storeon/preact';
import sfApiFetch from './sfapi';

// Possible statuses are 'created', 'pending_create', 'pending_destroy'
export default function useSubscriptions() {
    const {lists, user: {subscriptions}, dispatch} = useStoreon('lists', 'user');
    const data = lists.map((list) => ({
        ...list,
        subscribed: subscriptions.some((s) => s.listId === list.id && s.status !== 'pending_destroy')
    }));

    // console.info({lists, subscriptions});
    return {
        lists: data,
        add(item) {
            sfApiFetch(`lists/${item.pardotId}/subscribe/`)
                .then(() => dispatch('user/fetch'));
        },
        remove(item) {
            sfApiFetch(`lists/${item.pardotId}/unsubscribe/`)
                .then(() => dispatch('user/fetch'));
        }
    };
}
