import { createStoreon } from 'storeon';
import emailPrefs from './store/email-prefs';
import user from './store/user';
import schoolLookup from './store/school-lookup';

export const store = createStoreon([
    user, emailPrefs, schoolLookup
]);
