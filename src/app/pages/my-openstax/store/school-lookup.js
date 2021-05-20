import sfApiFetch from './sfapi';
import uniq from 'lodash/uniq';

// Takes a school entry from sfapi, returns a standard school
function sfSchoolToInstitution(school) {
    return ({
        id: school.salesforce_id,
        name: school.name || '[unknown school]'
    });
}

// Keeps a cache of looked-up schools
export default function schoolLookup(store) {
    const INITIAL_STATE = {
        schools: {}
    };

    store.on('@init', () => INITIAL_STATE);
    store.on('school-lookup/decode', (state, idList) => {
        const {schools} = state;
        const toLookUp = uniq(idList)
            .filter((id) => typeof id !== 'undefined' && !(id in schools));

        if (toLookUp.length === 0) {
            return null;
        }
        // Look them up async
        const promises = toLookUp.map((id) => sfApiFetch('schools', `/${id}`));

        Promise.all(promises).then((results) => {
            const newEntries = results
                .map(sfSchoolToInstitution)
                .reduce((a, b) => {
                    a[b.id] = b;
                    return a;
                }, {});

            store.dispatch('school-lookup/update', newEntries);
        });
        // Meanwhile, put placeholders in the state
        const placeholders = toLookUp.reduce((a, id) => {
            a[id] = '...';
            return a;
        }, {});

        return {
            schools: {...schools, ...placeholders}
        };
    });
    store.on('school-lookup/update', ({schools: oldSchools}, newSchools) => {
        return ({
            schools: {...oldSchools, ...newSchools}
        });
    });
}
