import {useState, useEffect} from 'react';
import { useStoreon } from 'storeon/preact';
import {accountsModel} from '~/models/usermodel';
import orderBy from 'lodash/orderBy';

function useAccountsModel() {
    // eslint-disable-next-line camelcase
    const [data, setData] = useState({contact_infos: []});

    accountsModel.load().then((m) => {
        if (m !== data) {
            setData(m);
        }
    });

    return data;
}

function useEmails(accountsData) {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData((accountsData.contact_infos || [])
            .filter((info) => info.type === 'EmailAddress')
            .map((info) => ({
                address: info.value,
                verified: info.is_verified,
                primary: info.is_guessed_preferred
            })));
    }, [accountsData]);

    return orderBy(data, ['primary', 'verified'], ['desc', 'desc']);
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
    const accountsData = useAccountsModel();
    const emails = useEmails(accountsData);

    if (user.error) {
        console.warn('Error reading account:', user.error);
        return {};
    }
    const {firstName, lastName, createdAt, salesforceId: contactId} = user.contact;
    const facultyVerified = accountsData.facultyStatus === 'confirmed_faculty';
    const role = facultyRoleLookup[accountsData.facultyStatus] || 'Student';

    return {
        accountsId: accountsData.id,
        firstName,
        lastName,
        emails,
        role,
        facultyVerified,
        createdAt,
        contactId
    };
}
