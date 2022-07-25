import React from 'react';
import useFlagContext from '~/components/shell/flag-context';
import sfApiFetch from '~/models/sfapi';
import $ from '~/helpers/$';

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

    return $.camelCaseKeys({...INITIAL_STATE, ...user});
}

export default function useMyOpenStaxUser(isVerified, fetchTime) {
    const [user, setUser] = React.useState({error: 'not loaded'});
    const {my_openstax: isEnabled} = useFlagContext();

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
