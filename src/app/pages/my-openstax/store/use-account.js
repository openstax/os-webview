import {useState, useEffect} from 'react';
import { useStoreon } from 'storeon/preact';
import useUserContext from '~/contexts/user';
import orderBy from 'lodash/orderBy';

function extractEmails(accountsModel) {
    return (accountsModel.contact_infos || [])
        .filter((info) => info.type === 'EmailAddress')
        .map((info) => ({
            address: info.value,
            verified: info.is_verified,
            primary: info.is_guessed_preferred
        }));
}

const facultyRoleLookup = {
    'confirmed_faculty': 'Faculty',
    'pending_faculty': 'Faculty'
};

/*
    Info comes from user.contact
*/
export default function useAccount() {
    const {user} = useStoreon('user');
    const {userModel} = useUserContext();
    const [value, setValue] = useState({});

    if (!user || user.error) {
        console.warn('Error reading account:', user.error);
    }

    useEffect(() => {
        if (!userModel || !user) {
            return;
        }
        const {accountsModel} = userModel;
        const emails = extractEmails(accountsModel);
        const {firstName, lastName, createdAt, salesforceId: contactId} = user.contact;
        const facultyVerified = accountsModel.faculty_status === 'confirmed_faculty';
        const role = facultyRoleLookup[accountsModel.faculty_status] || 'No instructor information';

        setValue({
            accountsId: accountsModel.id,
            firstName,
            lastName,
            emails: orderBy(emails, ['primary', 'verified'], ['desc', 'desc']),
            role,
            facultyVerified,
            createdAt,
            contactId
        });
    }, [user, userModel]);

    return value;
}
