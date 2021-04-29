import React from 'react';
import { useStoreon } from 'storeon/preact';
import { LoadingSection } from '../common';
import LabeledData from '~/pages/my-openstax/labeled-data/labeled-data';
import ProfileSection from './profile-section/profile-section';
import EmailPrefs from './email-prefs/email-prefs';
import orderBy from 'lodash/orderBy';
import cn from 'classnames';
import './account.scss';

const accountsHost = 'https://accounts-dev.openstax.org';

function Email({ email }) {
    return (
        <div className={cn('email', { unconfirmed: !email.verified, primary: email.primary })}>
            {email.address}
        </div>
    );
}

function AccountSection({store}) {
    const emails = orderBy(store.emails, ['primary', 'verified'], ['desc', 'desc']);

    return (
        <section>
            <h2>Account</h2>
            <a className='edit-link' href={accountsHost}>Edit account details</a>
            <section>
                <h3>General</h3>
                <div className='fields general-fields'>
                    <LabeledData label='First name' children={store.firstName} />
                    <LabeledData label='Last name' children={store.lastName} />
                </div>
            </section>
            <section>
                <h3>Password</h3>
                ••••••••••••
            </section>
            <section className='emails'>
                <h3>Email addresses</h3>
                {emails.map((email) => <Email email={email} key={email.address} />)}
            </section>
        </section>
    );
}

function Account({ store, id, hidden }) {
    return (
        <section id={id} hidden={hidden}>
            <h2 hidden>My Account</h2>
            <AccountSection store={store} />
            <ProfileSection />
            <EmailPrefs />
        </section>
    );
}

export default function AccountLoader({id, hidden}) {
    const { account: store } = useStoreon('account');

    return (
        store.ready ? <Account {...{store, id, hidden}} /> : <LoadingSection />
    );
}
