import sfApiFetch from './sfapi';
import $ from '~/helpers/$';

// const sfBookPromise = booksPromise.then((books) => salesforceTitles(books));
//
// function opportunityEditor() {
//     let adoptions = [];
//     const interesteds = [];
//
//     async function refresh({opportunity}) {
//         const bookData = await sfBookPromise;
//
//         adoptions = opportunity.map((op) => {
//             const dataItem = bookData.find((b) => b.value === op.book_name);
//
//             return {
//                 label: dataItem.text,
//                 value: dataItem.value,
//                 coverUrl: dataItem.coverUrl,
//                 salesforceId: bookData.salesforce_id
//             };
//         });
//     }
//
//     return {
//         get adoptions() {return adoptions;},
//         get interesteds() {return interesteds;},
//         refresh
//     };
// }
//
// const institutions = institutionEditor();
// const opportunities = opportunityEditor();
// const MOCK_OPPORTUNITY = {
//     'id': 26,
//     'salesforce_id': '006U000000ZH4uAIAT',
//     'term_year': '2015 - 16 Spring',
//     'book_name': 'Biology',
//     'contact_id': '003U000001hcCzuIAE',
//     'new': true,
//     'created_at': '2020-08-03T18:54:06.581Z',
//     'updated_at': '2020-09-08T14:00:39.431Z',
//     'close_date': '2016-01-05T00:00:00.000Z',
//     'stage_name': 'Confirmed Adoption Won',
//     'update_type': 'New Business',
//     'number_of_students': null,
//     'student_number_status': 'Annualized',
//     'time_period': 'Semester',
//     'class_start_date': '2016-01-05T00:00:00.000Z',
//     'school_id': '001U0000007gjDyIAI',
//     'book_id': 'a0ZU0000008pytKMAQ',
//     'lead_source': null,
//     'salesforce_updated': true,
//     'os_accounts_id': null,
//     'name': 'Biology - 2015 - 16 - Jennifer Example'
// };

export default function (store) {
    const INITIAL_STATE = {
        user: {
            contact: {},
            opportunity: [],
            lead: [{}],
            schools: []
        }
    };

    store.on('@init', () => {
        store.dispatch('user/fetch');
        return INITIAL_STATE;
    });

    store.on('user/fetch', async () => {
        const user = await sfApiFetch('users');

        if (!user.contact) {
            user.contact = {};
        }
        store.dispatch('user/update', $.camelCaseKeys(user));
    });
    store.on('user/update', (_, user) => ({user}));
}
