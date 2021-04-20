import React from 'react';
import Account from './account/account';
import Profile from './profile/profile';
import EmailPrefs from './email-prefs/email-prefs';

export default function MainPanel() {
    return (
        <React.Fragment>
            <Account />
            <hr />
            <Profile />
            <hr />
            <EmailPrefs />
        </React.Fragment>
    );
}
