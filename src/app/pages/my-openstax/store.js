import { createStoreon } from 'storeon';
import user from './store/user';
import lists from './store/lists';
import schoolLookup from './store/school-lookup';

export const store = createStoreon([
    user, schoolLookup, lists
]);
