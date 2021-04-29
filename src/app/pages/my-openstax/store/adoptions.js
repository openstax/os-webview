import sfApiFetch, { sfApiPost } from './sfapi';

/*
    Opaque object types:
    School
    Book
    Adoptions (for the user)

    Adoptions methods:
        fetchAdoptions(accountsId)
        setSchoolsForBook(book, [schools+]) - where schools+ includes student count
        getSchoolsForBook(book)
        getSchools()

    School methods:
        fetchSchoolsMatching(substring, excluding)

    Book methods:
        fetchBooks(excluding)

    Initial state: fetch user's adoptions
    Show books user has adopted
    Allow user to select an existing book and change list of schools+
    Allow user to select new book and add list of schools+
    On Save, setSchoolsForBook
*/

/*
    Example adoption record:
    {
        id: 1,
        salesforce_id: "0060v000008aPTxAAM",
        term_year: "fixed formula Spring",
        book_name: "College Algebra with Corequisite Support",
        contact_id: null,
        new: true,
        created_at: "2021-04-27T22:17:03.270Z",
        updated_at: "2021-04-27T22:17:03.270Z",
        close_date: "2020-09-02T00:00:00.000Z",
        stage_name: "Confirmed Adoption (1)",
        update_type: "New Business",
        number_of_students: "22.0",
        student_number_status: "Reported",
        time_period: "Year",
        class_start_date: null,
        school_id: null,
        book_id: "a0Z0v000002VhATEA0",
        lead_source: "openstax-salesforce-api",
        salesforce_updated: true,
        os_accounts_id: null,
        name: "new from openstax-salesforce-api"
    },
*/

function updateAdoptions(adoptions, {accountsId, book, adoptionStatus, schools, students}) {
    /* eslint-disable camelcase */
    // const adoptionsForBook = adoptions.filter((a) => a.book_name === book);
    const schoolsPlus = schools.map((s, i) => ({
        school: s,
        students: students[i]
    }));

    // Deletes

    // Updates

    // Inserts
    const inserts = schoolsPlus.map((sp) =>
        sfApiPost('opportunities', {
            opportunity: {
                book_name: book,
                number_of_students: sp.students,
                os_accounts_id: accountsId,
                school_id: sp.school,
                stage_name: adoptionStatus,
                close_date: '2020-09-02'
            }
        })
    );

    return inserts;
}

// Per documentation
// https://docs.google.com/document/d/111fYDFgoLAkKgmSp-jHS_JSYIqv5eHBCbcBG2E5Nz88/edit
// the required fields are book_name, os_account_id, and school_id
// stage_name should be either 'Confirmed Adoption Won' or 'Previous Adoption'
// function updateAdoptions(adoptions, { schoolId, accountsId, books }) {
//     const adoptionsForSchool = adoptions.find((entry) => entry.schoolId === schoolId);
//     const oldBooks = (adoptionsForSchool ? adoptionsForSchool.books : []);
//
//     /* eslint-disable camelcase */
//     // To remove, the stage_name is set to 'Previous Adoption'
//     const patches = oldBooks.map((adoption) => {
//         const updated = books.find((book) => book.title.value === adoption.abbreviation);
//         const payload = {
//             salesforce_id: adoption.opportunityId,
//             book_name: adoption.abbreviation,
//             os_accounts_id: accountsId,
//             school_id: schoolId
//         };
//         const payloadMod = updated ?
//             {
//                 number_of_students: updated.numStudents,
//                 name: 'updated'
//             } :
//             {
//                 stage_name: 'Previous Adoption',
//                 name: 'removed'
//             };
//
//         return sfApiPost(`opportunities/${adoption.opportunityId}`, {
//             opportunity: { ...payload, ...payloadMod }
//         }, 'PATCH');
//     });
//     const oldBookNames = oldBooks.map((b) => b.abbreviation);
//     const insert = books.filter((b) => !oldBookNames.includes(b.title.value))
//         .map((b) => sfApiPost('opportunities', {
//             opportunity: {
//                 book_name: b.title.value,
//                 number_of_students: b.numStudents,
//                 os_accounts_id: accountsId,
//                 school_id: schoolId,
//                 stage_name: 'Confirmed Adoption Won',
//                 close_date: '2020-09-02'
//             }
//         }));
//     /* eslint-enable camelcase */
//
//     return [...patches, ...insert];
// }

export default function (store) {
    const INITIAL_STATE = { adoptions: [] };

    store.on('@init', () => INITIAL_STATE);
    store.on('adoptions/get', (_, accountsId) => {
        sfApiFetch('opportunities', `/search/?os_accounts_id=${accountsId}`)
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
