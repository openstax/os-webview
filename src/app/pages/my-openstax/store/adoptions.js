import sfApiFetch, { sfApiPost } from './sfapi';
import uniq from 'lodash/uniq';

/*
    Opaque object types:
    School
    Book
    Adoptions (for the user)

    Adoptions methods:
        fetchAdoptions(accountsId)
        setBooksForSchool(school, [books+]) - where books+ includes student count
        getBooksForSchool(school)
        getSchools()

    School methods:
        fetchSchoolsMatching(substring, excluding)

    Book methods:
        fetchBooks(excluding)

    Initial state: fetch user's adoptions
    For each school, show books for school
    Allow user to select an existing school and change list of books+
    Allow user to select new school and add list of books+
    On Save, setBooksForSchool
*/
async function AdoptionEntry(id) {
    const name = (await sfApiFetch(`schools/${id}`)).name;

    return {
        schoolId: id,
        name,
        books: []
    };
}

async function organizeAdoptions(data) {
    if (data.error) {
        return null;
    }
    const confirmedAdoptions = data
        .filter((op) => op.stage_name.toLowerCase().includes('confirm'))
        .filter((op) => op.id && op.book_name && op.school_id);
    const schoolIds = uniq(confirmedAdoptions.map((d) => d.school_id));
    const result = await Promise.all(schoolIds.map(AdoptionEntry));

    for (const adoption of confirmedAdoptions) {
        const entry = result.find((e) => e.schoolId === adoption.school_id);

        if (entry) {
            entry.books.push({
                abbreviation: adoption.book_name,
                opportunityId: adoption.salesforce_id,
                numStudents: adoption.number_of_students || 0
            });
        } else {
            console.warn(`Did not find school id ${adoption.school_id} in`, result.map((r) => r.id));
        }
    }

    return result;
}

// Per documentation
// https://docs.google.com/document/d/111fYDFgoLAkKgmSp-jHS_JSYIqv5eHBCbcBG2E5Nz88/edit
// the required fields are book_name, os_account_id, and school_id
// stage_name should be either 'Confirmed Adoption Won' or 'Previous Adoption'
function updateAdoptions(adoptions, { schoolId, accountsId, books }) {
    const adoptionsForSchool = adoptions.find((entry) => entry.schoolId === schoolId);
    const oldBooks = (adoptionsForSchool ? adoptionsForSchool.books : []);

    /* eslint-disable camelcase */
    // To remove, the stage_name is set to 'Previous Adoption'
    const patches = oldBooks.map((adoption) => {
        const updated = books.find((book) => book.title.value === adoption.abbreviation);
        const payload = {
            salesforce_id: adoption.opportunityId,
            book_name: adoption.abbreviation,
            os_accounts_id: accountsId,
            school_id: schoolId
        };
        const payloadMod = updated ?
            {
                number_of_students: updated.numStudents,
                name: 'updated'
            } :
            {
                stage_name: 'Previous Adoption',
                name: 'removed'
            };

        return sfApiPost(`opportunities/${adoption.opportunityId}`, {
            opportunity: { ...payload, ...payloadMod }
        }, 'PATCH');
    });
    const oldBookNames = oldBooks.map((b) => b.abbreviation);
    const insert = books.filter((b) => !oldBookNames.includes(b.title.value))
        .map((b) => sfApiPost('opportunities', {
            opportunity: {
                book_name: b.title.value,
                number_of_students: b.numStudents,
                os_accounts_id: accountsId,
                school_id: schoolId,
                stage_name: 'Confirmed Adoption Won',
                close_date: '2020-09-02'
            }
        }));
    /* eslint-enable camelcase */

    return [...patches, ...insert];
}

export default function (store) {
    const INITIAL_STATE = { adoptions: [] };

    store.on('@init', () => INITIAL_STATE);
    store.on('adoptions/get', (_, accountsId) => {
        sfApiFetch('opportunities', `/search/?os_accounts_id=${accountsId}`)
            .then(organizeAdoptions)
            .then((adoptions) => {
                store.dispatch('adoptions/loaded', adoptions);
            });
        return INITIAL_STATE;
    });
    store.on('adoptions/loaded', (_, data) => {
        return {
            adoptions: data
        };
    });
    store.on('adoptions/update', ({ adoptions = [] }, payload) => {
        // THERE MUST BE an ID (salesforce_id) in the payload
        const updatePromises = updateAdoptions(adoptions, payload);

        Promise.all(updatePromises).then(() => store.dispatch('adoptions/get', payload.accountsId));

        return { adoptions };
    });
}
