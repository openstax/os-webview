import analytics from '~/helpers/analytics';
import {books, types, advanced} from './store';

function toLabel(store) {
    return store.value.join(',') || 'N/A';
}

function sendFilterEvent(name) {
    const category = `Partner tool ${name}`;

    analytics.sendPageEvent(category, 'filter', toLabel(books));
}

function sendAddEvent(actionObj) {
    if ('add' in actionObj) {
        sendFilterEvent(actionObj.add);
    }
}

types.on('notify', sendAddEvent);
advanced.on('notify', sendAddEvent);
books.on('notify', (obj) => {
    const addingBook = typeof obj === 'object' && 'add' in obj;

    if (addingBook) {
        types.value.forEach((typeFilter) => {
            sendFilterEvent(typeFilter);
        });
        advanced.value.forEach((advancedFilter) => {
            sendFilterEvent(advancedFilter);
        });
    }
});

function partnerDetails(partner) {
    analytics.sendPageEvent(
        `Partner tool ${partner}`,
        'open',
        toLabel(books)
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

export default {
    partnerDetails,
    requestInfo,
    partnerWebsite
};
