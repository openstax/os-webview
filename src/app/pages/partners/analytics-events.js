import React from 'react';
import analytics from '~/helpers/analytics';
import useSearchContext from './search-context';

function toLabel(storeValue) {
    return storeValue.join(',') || 'N/A';
}

export function useValueChangeEvents() {
    const {books, types, advanced} = useSearchContext();
    const filterIsSelected = Boolean(types.size || advanced.size || books.size);
    const sendFilterEvent = React.useCallback(
        (name) => {
            const category = `Partner tool ${name}`;

            analytics.sendPageEvent(category, 'filter', toLabel(books.value));
        },
        [books]
    );
    const SAERef = React.useRef();

    SAERef.current = React.useCallback(
        (actionObj) => {
            if (actionObj && 'add' in actionObj) {
                sendFilterEvent(actionObj.add);
            }
        },
        [sendFilterEvent]
    );
    // Some indirection to prevent duplicate calls due to updated hook
    const sendAddEvent = React.useCallback(
        (...args) => SAERef.current(...args),
        []
    );

    React.useEffect(
        () => sendAddEvent(types.lastAction),
        [types.lastAction, sendAddEvent]
    );
    React.useEffect(
        () => sendAddEvent(advanced.lastAction),
        [advanced.lastAction, sendAddEvent]
    );
    React.useEffect(
        () => {
            if (books.lastAction?.add && filterIsSelected) {
                sendFilterEvent(books.value);
                advanced.value.forEach((advancedFilter) => {
                    sendFilterEvent(advancedFilter);
                });
            }
        },
        [books, books.lastAction, advanced, sendFilterEvent, filterIsSelected]
    );
}

function usePartnerDetailsEvent() {
    const {books} = useSearchContext();

    return React.useCallback(
        (partner) => analytics.sendPageEvent(
            `Partner tool ${partner} lightbox`,
            'open',
            toLabel(books.value)
        ),
        [books]
    );
}

function lightboxScroll(partner) {
    analytics.sendPageEvent(
        `Partner tool ${partner} lightbox scroll`,
        'scroll',
        null
    );
}

function requestInfo(partner) {
    analytics.sendPageEvent(
        'Partner tool Request info button',
        'submit',
        partner
    );
}

function partnerWebsite(url) {
    analytics.sendPageEvent(
        'Partner tool Partner website button',
        'submit',
        url
    );
}

function viewReviews(partner) {
    analytics.sendPageEvent(
        'Partner tool reading reviews',
        'open',
        partner
    );
}

function submitReview(partner) {
    analytics.sendPageEvent(
        'Partner tool review submission',
        'submit',
        partner
    );
}

export default {
    usePartnerDetailsEvent,
    lightboxScroll,
    requestInfo,
    partnerWebsite,
    viewReviews,
    submitReview
};
