import { useStoreon } from 'storeon/preact';
import {sfApiPost} from './sfapi';
import useAccount from '~/pages/my-openstax/store/use-account';

/*
    TODO: iron out correct values for stage_name for adoption vs. interest
    Back end should handle close_date, which should be the date that either
    the adoption is made or dropped.
*/
function today() {
    const date = new Date();
    const fields = date.toLocaleDateString().split('/');

    return `${fields[2]}-${fields[1]}-${fields[0]}`;
}

// Adoptions are indexed by book name and values are dictionaries
function adoptionsFromOpportunities(opportunities) {
    const adoptions = {};

    for (const op of opportunities) {
        if (op.stageName.toLowerCase().includes('previous')) {
            continue;
        }
        if (!(op.bookName in adoptions)) {
            adoptions[op.bookName] = [];
        }
        adoptions[op.bookName].push({
            id: op.id,
            salesforceId: op.salesforceId,
            students: op.numberOfStudents,
            schoolId: op.schoolId,
            stageName: op.stageName
        });
    }

    return adoptions;
}

export default function useAdoptions() {
    const {user, dispatch} = useStoreon('user');
    const {accountsId} = useAccount();

    function add({book, students, schools, adoptionStatus}) {
        const promises = schools.map((s, i) =>
            /* eslint-disable camelcase */
            sfApiPost(
                'opportunities',
                {
                    opportunity: {
                        book_name: book,
                        number_of_students: students[i],
                        os_accounts_id: accountsId,
                        school_id: s,
                        stage_name: adoptionStatus,
                        close_date: today()
                    }
                }
            )
        );

        Promise.all(promises).then(() => dispatch('user/fetch'));
    }

    // An adoption can have multiple schools, and some of them may be new
    // opportunities rather than updates.
    function update(adoption, {book, students, schools, adoptionStatus}) {
        const promises = schools.map((s, i) => {
            const isUpdate = adoption.find((a) => a.schoolId === s);

            /* eslint-disable camelcase */
            return isUpdate ?
                sfApiPost(
                    `opportunities/${isUpdate.id}`,
                    {
                        opportunity: {
                            salesforce_id: isUpdate.salesforceId,
                            book_name: book,
                            number_of_students: students[i],
                            os_accounts_id: accountsId,
                            school_id: s,
                            stage_name: adoptionStatus,
                            close_date: today()
                        }
                    },
                    'PATCH'
                ) :
                add({book, students, schools, adoptionStatus});
        });

        Promise.all(promises).then(() => dispatch('user/fetch'));
    }

    return {
        adoptions: adoptionsFromOpportunities(user.opportunity),
        add,
        update
    };
}
