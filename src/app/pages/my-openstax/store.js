import { createStoreon } from 'storeon';
import user from './store/user';
import books from './store/books';
import emailPrefs from './store/email-prefs';
import adoptions from './store/adoptions';

export const store = createStoreon([user, books, emailPrefs, adoptions]);

store.on('account/loaded', (_, accountData) => {
    store.dispatch('adoptions/get', accountData.accountsId);
});
