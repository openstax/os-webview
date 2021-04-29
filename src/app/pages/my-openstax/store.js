import { createStoreon } from 'storeon';
import account from './store/account';
import books from './store/books';
import emailPrefs from './store/email-prefs';
import adoptions from './store/adoptions';
import user from './store/user';

export const store = createStoreon([account, user, books, emailPrefs, adoptions]);

store.on('account/loaded', (_, accountData) => {
    store.dispatch('adoptions/get', accountData.accountsId);
});
