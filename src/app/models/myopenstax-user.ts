import React from 'react';
import useSharedDataContext from '~/contexts/shared-data';
import sfApiFetch from '~/models/sfapi';
import {camelCaseKeys} from '~/helpers/page-data-utils';

const INITIAL_STATE = {
    user: {
        contact: {},
        opportunities: [],
        schools: [],
        subscriptions: []
    }
};

type OSUser = {
    error?: string;
    contact?: {
        firstName: string;
        lastName: string;
        createdAt: string;
        salesforceId: string;
    };
};

async function fetchUser() {
    const user = await sfApiFetch('users');

    return camelCaseKeys({...INITIAL_STATE, ...user}) as OSUser;
}

export default function useMyOpenStaxUser(
    isVerified: boolean,
    fetchTime: number
) {
    const [user, setUser] = React.useState<OSUser>({error: 'not loaded'});
    const {flags} = useSharedDataContext();

    React.useEffect(() => {
        const isEnabled = flags && flags.my_openstax;

        if (isEnabled) {
            if (isVerified) {
                fetchUser().then(setUser);
            } else {
                setUser({error: 'Not faculty verified'});
            }
        }
    }, [flags, isVerified, fetchTime]);

    return user;
}
