import {useState, useEffect} from 'react';
import useUserContext from '~/contexts/user';
import type { UserModelType } from '~/models/usermodel';
import orderBy from 'lodash/orderBy';

function extractEmails(accountsModel: UserModelType['accountsModel']) {
    return (accountsModel.contact_infos || [])
        .filter((info) => info.type === 'EmailAddress')
        .map((info) => ({
            address: info.value,
            verified: info.is_verified,
            primary: info.is_guessed_preferred
        }));
}

// We might try keys other than these, and that is ok.
const facultyRoleLookup: Record<string, string> = {
    'confirmed_faculty': 'Faculty',
    'pending_faculty': 'Faculty'
};

/*
    Info comes from user.contact
*/
export default function useAccount() {
    const {userModel, myOpenStaxUser: user} = useUserContext();
    const [value, setValue] = useState({});

    if (!user || user.error) {
        console.warn('Error reading account:', user.error);
    }

    useEffect(() => {
        if (!userModel || !user?.contact) {
            return;
        }
        const {accountsModel} = userModel;
        const emails = extractEmails(accountsModel);
        const {firstName, lastName, createdAt, salesforceId: contactId} = user.contact;
        const facultyVerified = accountsModel.faculty_status === 'confirmed_faculty';
        const role = facultyRoleLookup[accountsModel.faculty_status ?? ''] || 'No instructor information';

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
