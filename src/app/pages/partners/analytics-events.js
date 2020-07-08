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

function filterIsSelected() {
    return types.value || advanced.value.length > 0;
}

types.on('notify', sendAddEvent);
advanced.on('notify', sendAddEvent);
books.on('notify', (obj) => {
    const addingBook = typeof obj === 'object' && 'add' in obj;

    if (addingBook && filterIsSelected()) {
        sendFilterEvent(types.value);
        advanced.value.forEach((advancedFilter) => {
            sendFilterEvent(advancedFilter);
        });
    }
});

function partnerDetails(partner) {
    analytics.sendPageEvent(
        `Partner tool ${partner} lightbox`,
        'open',
        toLabel(books)
    );
}

function lightboxScroll(partner) {
    analytics.sendPageEvent(
        `Partner tool ${partner} lightbox scroll`,
        'scroll',
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
    lightboxScroll,
    requestInfo,
    partnerWebsite
};
