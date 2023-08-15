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

async function fetchUser() {
    const user = await sfApiFetch('users');

    return camelCaseKeys({...INITIAL_STATE, ...user});
}

export default function useMyOpenStaxUser(isVerified, fetchTime) {
    const [user, setUser] = React.useState({error: 'not loaded'});
    const {flags: {my_openstax: isEnabled}} = useSharedDataContext();

    React.useEffect(() => {
        if (isEnabled) {
            if (isVerified) {
                fetchUser().then(setUser);
            } else {
                setUser({error: 'Not faculty verified'});
            }
        }
    }, [isEnabled, isVerified, fetchTime]);

    return user;
}
